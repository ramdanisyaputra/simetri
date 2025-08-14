<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'icon',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Check if this is a system default category
    public function isDefault()
    {
        return $this->user_id === null;
    }

    // Check if this is a user-created category
    public function isUserCategory()
    {
        return $this->user_id !== null;
    }
}
