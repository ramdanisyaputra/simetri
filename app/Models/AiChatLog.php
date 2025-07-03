<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiChatLog extends Model
{
    protected $fillable = [
        'user_id',
        'prompt',
        'response',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
