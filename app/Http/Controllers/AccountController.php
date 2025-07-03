<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $userId = Auth::user()->id;
        $accounts = Account::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        $accountsWithBalance = $accounts->map(function ($account) {
            return [
                'id' => $account->id,
                'user_id' => $account->user_id,
                'name' => $account->name,
                'type' => $account->type,
                'initial_balance' => $account->initial_balance,
                'description' => $account->description,
                'created_at' => $account->created_at,
                'updated_at' => $account->updated_at,
            ];
        });

        $data['accounts'] = $accountsWithBalance;

        return Inertia::render('Accounts/Index', $data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'initial_balance' => 'nullable|numeric',
            'description' => 'nullable|string|max:500',
        ]);

        Account::create([
            'user_id' => Auth::user()->id,
            'name' => $request->name,
            'type' => $request->type,
            'initial_balance' => $request->initial_balance ?? 0,
            'description' => $request->description,
        ]);

        return redirect()->route('accounts.index')->with('success', 'Account created successfully.');
    }

    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this account.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'initial_balance' => 'nullable|numeric',
            'description' => 'nullable|string|max:500',
        ]);

        $account->update([
            'name' => $request->name,
            'type' => $request->type,
            'initial_balance' => $request->initial_balance ?? $account->initial_balance,
            'description' => $request->description,
        ]);

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully.');
    }

    public function destroy(Account $account)
    {
        if ($account->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized access to this account.');
        }

        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Account deleted successfully.');
    }
}
