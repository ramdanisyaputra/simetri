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
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ]);

        $account = Account::where('id', $request->account_id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if (!$account) {
            abort(403, 'Unauthorized access to this account.');
        }

        DB::transaction(function () use ($request) {
            Transaction::create([
                'user_id' => Auth::user()->id,
                'account_id' => $request->account_id,
                'category_id' => $request->category_id,
                'type' => $request->type,
                'amount' => $request->amount,
                'description' => $request->description,
                'transaction_date' => $request->transaction_date,
            ]);

            $account = Account::find($request->account_id);
            if ($request->type === 'income') {
                $account->increment('initial_balance', $request->amount);
            } elseif ($request->type === 'expense') {
                $account->decrement('initial_balance', $request->amount);
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
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ]);

        $account = Account::where('id', $request->account_id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if (!$account) {
            abort(403, 'Unauthorized access to this account.');
        }

        DB::transaction(function () use ($request, $transaction) {
            $oldAccount = Account::find($transaction->account_id);
            $oldType = $transaction->type;
            $oldAmount = $transaction->amount;

            if ($oldAccount && ($oldAccount->id !== $request->account_id || $oldType !== $request->type)) {
                if ($oldType === 'income') {
                    $oldAccount->decrement('initial_balance', $oldAmount);
                } elseif ($oldType === 'expense') {
                    $oldAccount->increment('initial_balance', $oldAmount);
                }
            }

            $transaction->update([
                'account_id' => $request->account_id,
                'category_id' => $request->category_id,
                'type' => $request->type,
                'amount' => $request->amount,
                'description' => $request->description,
                'transaction_date' => $request->transaction_date,
            ]);

            $newAccount = Account::find($request->account_id);

            if ($newAccount) {
                if ($request->type === 'income') {
                    $newAccount->increment('initial_balance', $request->amount);
                } elseif ($request->type === 'expense') {
                    $newAccount->decrement('initial_balance', $request->amount);
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
            $account = Account::find($transaction->account_id);
            if ($transaction->type === 'income') {
                $account->decrement('initial_balance', $transaction->amount);
            } elseif ($transaction->type === 'expense') {
                $account->increment('initial_balance', $transaction->amount);
            }

            $transaction->delete();
        });

        return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
    }
}
