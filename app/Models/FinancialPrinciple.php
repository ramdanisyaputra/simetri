<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialPrinciple extends Model
{
    public $timestamps = false; 

    public function userProgress()
    {
        return $this->hasMany(UserFinancialProgress::class, 'principle_id');
    }
}
