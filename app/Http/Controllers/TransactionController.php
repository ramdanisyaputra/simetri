<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::user()->id;
        
        // Get month and year filters from request, default to current month/year
        $selectedMonth = $request->get('month', Carbon::now()->month);
        $selectedYear = $request->get('year', Carbon::now()->year);
        
        // Ensure we have valid integers
        $month = (int) $selectedMonth;
        $year = (int) $selectedYear;
        
        // Validate month and year values
        if ($month < 1 || $month > 12) {
            $month = Carbon::now()->month;
        }
        if ($year < 1900 || $year > 2100) {
            $year = Carbon::now()->year;
        }
        
        $transactions = Transaction::with(['account', 'category'])
            ->where('user_id', $userId)
            ->whereMonth('transaction_date', $month)
            ->whereYear('transaction_date', $year)
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $monthlyStats = Transaction::where('user_id', $userId)
            ->whereMonth('transaction_date', $month)
            ->whereYear('transaction_date', $year)
            ->selectRaw('
                type,
                SUM(amount) as total_amount
            ')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        $monthlyIncome = $monthlyStats->get('income')->total_amount ?? 0;
        $monthlyExpense = $monthlyStats->get('expense')->total_amount ?? 0;

        $accounts = Account::where('user_id', $userId)->get();
        $categories = Category::where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
              ->orWhereNull('user_id');
        })->get();

        // Create a Carbon instance for formatting
        $dateInstance = Carbon::create($year, $month, 1);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'monthlyIncome' => $monthlyIncome,
            'monthlyExpense' => $monthlyExpense,
            'currentMonth' => $dateInstance->format('F Y'), // Format as "August 2025"
            'selectedMonth' => $month, // Current selected month number
            'selectedYear' => $year, // Current selected year
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'destination_account_id' => 'required_if:type,transfer|nullable|exists:accounts,id|different:account_id',
        ]);

        $account = Account::where('id', $request->account_id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if (!$account) {
            abort(403, 'Unauthorized access to this account.');
        }

        // For transfers, validate destination account belongs to user
        if ($request->type === 'transfer') {
            $destinationAccount = Account::where('id', $request->destination_account_id)
                ->where('user_id', Auth::user()->id)
                ->first();

            if (!$destinationAccount) {
                abort(403, 'Unauthorized access to destination account.');
            }
        }

        DB::transaction(function () use ($request) {
            $transactionData = [
                'user_id' => Auth::user()->id,
                'account_id' => $request->account_id,
                'category_id' => $request->category_id,
                'type' => $request->type,
                'amount' => $request->amount,
                'description' => $request->description,
                'transaction_date' => $request->transaction_date,
                'destination_account_id' => $request->destination_account_id,
            ];

            Transaction::create($transactionData);

            // Update account balances
            $sourceAccount = Account::find($request->account_id);
            
            if ($request->type === 'income') {
                $sourceAccount->increment('initial_balance', $request->amount);
            } elseif ($request->type === 'expense') {
                $sourceAccount->decrement('initial_balance', $request->amount);
            } elseif ($request->type === 'transfer') {
                // Decrease from source account
                $sourceAccount->decrement('initial_balance', $request->amount);
                
                // Increase destination account
                $destinationAccount = Account::find($request->destination_account_id);
                $destinationAccount->increment('initial_balance', $request->amount);
            }
        });

        return redirect()->route('transactions.index')->with('success', 'Transaction created successfully.');
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this transaction.');
        }

        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
            'destination_account_id' => 'required_if:type,transfer|nullable|exists:accounts,id|different:account_id',
        ]);

        $account = Account::where('id', $request->account_id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if (!$account) {
            abort(403, 'Unauthorized access to this account.');
        }

        // For transfers, validate destination account belongs to user
        if ($request->type === 'transfer') {
            $destinationAccount = Account::where('id', $request->destination_account_id)
                ->where('user_id', Auth::user()->id)
                ->first();

            if (!$destinationAccount) {
                abort(403, 'Unauthorized access to destination account.');
            }
        }

        DB::transaction(function () use ($request, $transaction) {
            // First, reverse the old transaction's effect on account balances
            $oldSourceAccount = Account::find($transaction->account_id);
            $oldType = $transaction->type;
            $oldAmount = $transaction->amount;
            $oldDestinationAccountId = $transaction->destination_account_id;

            if ($oldSourceAccount) {
                if ($oldType === 'income') {
                    $oldSourceAccount->decrement('initial_balance', $oldAmount);
                } elseif ($oldType === 'expense') {
                    $oldSourceAccount->increment('initial_balance', $oldAmount);
                } elseif ($oldType === 'transfer') {
                    // Reverse the transfer: add back to source, subtract from destination
                    $oldSourceAccount->increment('initial_balance', $oldAmount);
                    if ($oldDestinationAccountId) {
                        $oldDestinationAccount = Account::find($oldDestinationAccountId);
                        if ($oldDestinationAccount) {
                            $oldDestinationAccount->decrement('initial_balance', $oldAmount);
                        }
                    }
                }
            }

            // Update the transaction
            $transaction->update([
                'account_id' => $request->account_id,
                'category_id' => $request->category_id,
                'type' => $request->type,
                'amount' => $request->amount,
                'description' => $request->description,
                'transaction_date' => $request->transaction_date,
                'destination_account_id' => $request->destination_account_id,
            ]);

            // Apply the new transaction's effect on account balances
            $newSourceAccount = Account::find($request->account_id);

            if ($newSourceAccount) {
                if ($request->type === 'income') {
                    $newSourceAccount->increment('initial_balance', $request->amount);
                } elseif ($request->type === 'expense') {
                    $newSourceAccount->decrement('initial_balance', $request->amount);
                } elseif ($request->type === 'transfer') {
                    // Apply the transfer: subtract from source, add to destination
                    $newSourceAccount->decrement('initial_balance', $request->amount);
                    $newDestinationAccount = Account::find($request->destination_account_id);
                    if ($newDestinationAccount) {
                        $newDestinationAccount->increment('initial_balance', $request->amount);
                    }
                }
            }
        });

        return redirect()->route('transactions.index')->with('success', 'Transaction updated successfully.');
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this transaction.');
        }

        DB::transaction(function () use ($transaction) {
            $sourceAccount = Account::find($transaction->account_id);
            
            if ($sourceAccount) {
                if ($transaction->type === 'income') {
                    $sourceAccount->decrement('initial_balance', $transaction->amount);
                } elseif ($transaction->type === 'expense') {
                    $sourceAccount->increment('initial_balance', $transaction->amount);
                } elseif ($transaction->type === 'transfer') {
                    // Reverse the transfer: add back to source, subtract from destination
                    $sourceAccount->increment('initial_balance', $transaction->amount);
                    
                    if ($transaction->destination_account_id) {
                        $destinationAccount = Account::find($transaction->destination_account_id);
                        if ($destinationAccount) {
                            $destinationAccount->decrement('initial_balance', $transaction->amount);
                        }
                    }
                }
            }

            $transaction->delete();
        });

        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
    }
}
