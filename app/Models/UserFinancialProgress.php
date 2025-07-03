<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFinancialProgress extends Model
{
    protected $fillable = [
        'user_id',
        'principle_id',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function principle()
    {
        return $this->belongsTo(FinancialPrinciple::class, 'principle_id');
    }
}
