<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Add destination account for transfers
            $table->foreignId('destination_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            
            // Update the type enum to include transfer
            $table->enum('type', ['expense', 'income', 'transfer'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Remove destination account column
            $table->dropForeign(['destination_account_id']);
            $table->dropColumn('destination_account_id');
            
            // Revert the type enum back to original
            $table->enum('type', ['expense', 'income'])->change();
        });
    }
};
