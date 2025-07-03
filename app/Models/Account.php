<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'initial_balance',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getCurrentBalanceAttribute()
    {
        $income = $this->transactions()
            ->where('type', 'income')
            ->sum('amount');
            
        $expenses = $this->transactions()
            ->where('type', 'expense')
            ->sum('amount');
            
        $transfersOut = $this->transactions()
            ->where('type', 'transfer')
            ->where('account_id', $this->id)
            ->sum('amount');
            
        $transfersIn = 0;

        return $this->initial_balance + $income - $expenses - $transfersOut + $transfersIn;
    }
}
