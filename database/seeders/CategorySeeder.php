<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expenses = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Belanja', 'Kesehatan', 'Pendidikan'];
        foreach ($expenses as $cat) {
            Category::updateOrCreate([
                'name' => $cat,
                'type' => 'expense',
                'user_id' => null
            ]);
        }

        $incomes = ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Hadiah'];
        foreach ($incomes as $cat) {
            Category::updateOrCreate([
                'name' => $cat,
                'type' => 'income',
                'user_id' => null
            ]);
        }
    }
}
