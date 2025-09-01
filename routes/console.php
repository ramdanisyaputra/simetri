<?php

use App\Console\Commands\ProcessRecurringTransactions;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule recurring transactions to process daily at midnight
Schedule::command(ProcessRecurringTransactions::class)->daily();
