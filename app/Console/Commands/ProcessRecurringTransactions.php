<?php

namespace App\Console\Commands;

use App\Models\RecurringTransaction;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessRecurringTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:process-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process recurring transactions and create new transactions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        $this->info("Processing recurring transactions for {$today->format('Y-m-d')}");

        $recurringTransactions = RecurringTransaction::with(['user', 'account', 'category'])
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->get();

        $processed = 0;

        foreach ($recurringTransactions as $recurring) {
            if ($this->shouldProcessToday($recurring, $today)) {
                // Check if transaction already exists for today
                $existingTransaction = Transaction::where('user_id', $recurring->user_id)
                    ->where('account_id', $recurring->account_id)
                    ->where('category_id', $recurring->category_id)
                    ->where('type', $recurring->type)
                    ->where('amount', $recurring->amount)
                    ->whereDate('transaction_date', $today)
                    ->first();

                if (!$existingTransaction) {
                    // Create new transaction
                    Transaction::create([
                        'user_id' => $recurring->user_id,
                        'account_id' => $recurring->account_id,
                        'category_id' => $recurring->category_id,
                        'type' => $recurring->type,
                        'amount' => $recurring->amount,
                        'description' => $recurring->description . ' (Recurring)',
                        'transaction_date' => $today,
                    ]);

                    // Update account balance
                    $account = $recurring->account;
                    if ($recurring->type === 'expense') {
                        $account->decrement('balance', $recurring->amount);
                    } else {
                        $account->increment('balance', $recurring->amount);
                    }

                    $processed++;
                    $this->info("Created recurring transaction: {$recurring->description} - {$recurring->amount}");
                }
            }
        }

        $this->info("Processed {$processed} recurring transactions.");
        return 0;
    }

    /**
     * Determine if a recurring transaction should be processed today
     */
    private function shouldProcessToday(RecurringTransaction $recurring, Carbon $today): bool
    {
        switch ($recurring->frequency) {
            case 'daily':
                return true;

            case 'weekly':
                // Process every 7 days from start date
                $daysSinceStart = $today->diffInDays($recurring->start_date);
                return $daysSinceStart % 7 === 0;

            case 'monthly':
                // Process on specific day of month or last day if day doesn't exist
                $targetDay = $recurring->day_of_month ?? $recurring->start_date->day;
                $lastDayOfMonth = $today->copy()->endOfMonth()->day;
                
                // If target day is greater than days in this month, use last day
                $actualDay = min($targetDay, $lastDayOfMonth);
                
                return $today->day === $actualDay;

            case 'yearly':
                // Process on same month and day as start date
                return $today->month === $recurring->start_date->month 
                    && $today->day === $recurring->start_date->day;

            default:
                return false;
        }
    }
}
