<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'current_value',
        'acquisition_date',
    ];

    protected $casts = [
        'acquisition_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
