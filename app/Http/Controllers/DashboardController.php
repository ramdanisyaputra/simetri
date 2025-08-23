<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::user()->id;
        $currentMonth = Carbon::now();
        $previousMonth = Carbon::now()->subMonth();
        
        $accounts = Account::where('user_id', $userId)->get();
        $totalBalance = $accounts->where('type', '!=', 'credit')->sum('initial_balance');
        
        $accountsWithBalances = $accounts->map(function ($account) {
            return [
                'id' => $account->id,
                'name' => $account->name,
                'type' => $account->type,
                'balance' => $account->initial_balance,
                'created_at' => $account->created_at,
            ];
        });
        
        $currentMonthStats = $this->getMonthlyStats($userId, $currentMonth);
        $previousMonthStats = $this->getMonthlyStats($userId, $previousMonth);
        
        $incomeGrowth = $this->calculateGrowthPercentage(
            $previousMonthStats['income'], 
            $currentMonthStats['income']
        );
        $expenseGrowth = $this->calculateGrowthPercentage(
            $previousMonthStats['expense'], 
            $currentMonthStats['expense']
        );
        
        $recentTransactions = Transaction::with(['account', 'category'])
            ->where('user_id', $userId)
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        $topCategories = Transaction::with('category')
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $currentMonth->month)
            ->whereYear('transaction_date', $currentMonth->year)
            ->whereNotNull('category_id')
            ->select('category_id', DB::raw('SUM(amount) as total_amount'))
            ->groupBy('category_id')
            ->orderBy('total_amount', 'desc')
            ->limit(5)
            ->get();
        
        $dailySpending = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [
                Carbon::now()->subDays(6)->startOfDay(),
                Carbon::now()->endOfDay()
            ])
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(amount) as total_amount')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        $dailySpendingFormatted = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayData = $dailySpending->firstWhere('date', $date);
            $dailySpendingFormatted->push([
                'date' => Carbon::parse($date)->format('M j'),
                'amount' => $dayData ? (float) $dayData->total_amount : 0
            ]);
        }
        
        $monthlyTrends = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStats = $this->getMonthlyStats($userId, $month);
            
            $monthlyTrends->push([
                'month' => $month->format('M'),
                'income' => $monthStats['income'],
                'expense' => $monthStats['expense'],
                'net' => $monthStats['income'] - $monthStats['expense']
            ]);
        }
        
        $savingsRate = $currentMonthStats['income'] > 0 
            ? (($currentMonthStats['income'] - $currentMonthStats['expense']) / $currentMonthStats['income']) * 100 
            : 0;
        
        $expenseRatio = $currentMonthStats['income'] > 0 
            ? ($currentMonthStats['expense'] / $currentMonthStats['income']) * 100 
            : 0;
        
        $data = [
            'summary' => [
                'totalBalance' => $totalBalance,
                'currentMonthIncome' => $currentMonthStats['income'],
                'currentMonthExpense' => $currentMonthStats['expense'],
                'currentMonthNet' => $currentMonthStats['income'] - $currentMonthStats['expense'],
                'incomeGrowth' => $incomeGrowth,
                'expenseGrowth' => $expenseGrowth,
                'savingsRate' => round($savingsRate, 1),
                'expenseRatio' => round($expenseRatio, 1),
            ],
            'accounts' => $accountsWithBalances,
            'recentTransactions' => $recentTransactions,
            'topCategories' => $topCategories,
            'dailySpending' => $dailySpendingFormatted,
            'monthlyTrends' => $monthlyTrends,
            'stats' => [
                'totalAccounts' => $accounts->count(),
                'totalCategories' => Category::where(function ($query) use ($userId) {
                    $query->where('user_id', $userId)->orWhereNull('user_id');
                })->count(),
                'totalTransactions' => Transaction::where('user_id', $userId)
                    ->whereMonth('transaction_date', $currentMonth->month)
                    ->whereYear('transaction_date', $currentMonth->year)
                    ->count(),
            ]
        ];
        
        return Inertia::render('dashboard', $data);
    }
    
    private function getMonthlyStats($userId, Carbon $month)
    {
        $stats = Transaction::where('user_id', $userId)
            ->whereMonth('transaction_date', $month->month)
            ->whereYear('transaction_date', $month->year)
            ->selectRaw('
                type,
                SUM(amount) as total_amount
            ')
            ->groupBy('type')
            ->get()
            ->keyBy('type');
        
        return [
            'income' => $stats->get('income')->total_amount ?? 0,
            'expense' => $stats->get('expense')->total_amount ?? 0,
            'transfer' => $stats->get('transfer')->total_amount ?? 0,
        ];
    }
    
    private function calculateGrowthPercentage($previous, $current)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }
}
