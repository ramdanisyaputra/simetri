<?php

namespace Database\Seeders;

use App\Models\FinancialPrinciple;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinancialPrincipleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $principles = [
            [
                'step_number' => 1,
                'title' => 'Punya 10 Juta Pertama di Rekening',
                'description' => 'Langkah awal untuk membangun kebiasaan menabung dan memiliki fondasi finansial yang sehat.'
            ],
            [
                'step_number' => 2,
                'title' => 'Lunasi Seluruh Utang Konsumtif',
                'description' => 'Bebaskan diri dari utang dengan bunga tinggi seperti kartu kredit dan pinjaman online agar arus kas lebih lancar.'
            ],
            [
                'step_number' => 3,
                'title' => 'Siapkan Dana Darurat 3-6 Bulan',
                'description' => 'Amankan jaring pengaman finansial setara dengan 3 hingga 6 bulan total pengeluaran bulanan Anda.'
            ],
            [
                'step_number' => 4,
                'title' => 'Mulai Investasi 20% Penghasilan',
                'description' => 'Alokasikan setidaknya 20% dari penghasilan bulanan ke berbagai instrumen investasi untuk pertumbuhan aset.'
            ],
            [
                'step_number' => 5,
                'title' => 'Siapkan Dana Pendidikan Anak',
                'description' => 'Mulai merencanakan dan mengumpulkan biaya pendidikan untuk masa depan anak-anak.'
            ],
        ];

        foreach ($principles as $principle) {
            FinancialPrinciple::updateOrCreate(
                ['step_number' => $principle['step_number']],
                $principle
            );
        }
    }
}
