<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecurringTransactionRequest;
use App\Http\Requests\UpdateRecurringTransactionRequest;
use App\Models\Account;
use App\Models\Category;
use App\Models\RecurringTransaction;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RecurringTransactionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        
        $recurringTransactions = RecurringTransaction::with(['account', 'category'])
            ->where('user_id', $userId)
            ->when($request->search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->frequency, function ($query, $frequency) {
                $query->where('frequency', $frequency);
            })
            ->latest()
            ->get();

        $accounts = Account::where('user_id', $userId)->get();
        $categories = Category::where('user_id', $userId)
            ->orWhereNull('user_id')
            ->get();

        return Inertia::render('RecurringTransactions/Index', [
            'recurringTransactions' => $recurringTransactions,
            'accounts' => $accounts,
            'categories' => $categories,
            'filters' => $request->only(['search', 'type', 'frequency']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $userId = Auth::id();
        $accounts = Account::where('user_id', $userId)->get();
        $categories = Category::where('user_id', $userId)
            ->orWhereNull('user_id')
            ->get();

        return Inertia::render('RecurringTransactions/Create', [
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecurringTransactionRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();

        RecurringTransaction::create($validated);

        return redirect()
            ->back()
            ->with('success', 'Recurring transaction created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(RecurringTransaction $recurringTransaction)
    {
        if ($recurringTransaction->user_id !== Auth::id()) {
            abort(403);
        }

        $recurringTransaction->load(['account', 'category']);

        return Inertia::render('RecurringTransactions/Show', [
            'recurringTransaction' => $recurringTransaction,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RecurringTransaction $recurringTransaction)
    {
        if ($recurringTransaction->user_id !== Auth::id()) {
            abort(403);
        }

        $userId = Auth::id();
        $accounts = Account::where('user_id', $userId)->get();
        $categories = Category::where('user_id', $userId)
            ->orWhereNull('user_id')
            ->get();

        $recurringTransaction->load(['account', 'category']);

        return Inertia::render('RecurringTransactions/Edit', [
            'recurringTransaction' => $recurringTransaction,
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecurringTransactionRequest $request, RecurringTransaction $recurringTransaction)
    {
        if ($recurringTransaction->user_id !== Auth::id()) {
            abort(403);
        }

        $recurringTransaction->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Recurring transaction updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RecurringTransaction $recurringTransaction)
    {
        if ($recurringTransaction->user_id !== Auth::id()) {
            abort(403);
        }

        $recurringTransaction->delete();

        return redirect()
            ->back()
            ->with('success', 'Recurring transaction deleted successfully.');
    }
}
