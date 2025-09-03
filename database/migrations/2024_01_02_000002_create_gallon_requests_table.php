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
        Schema::create('gallon_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->comment('Number of gallons requested');
            $table->enum('type', ['input', 'output'])->comment('Type of request: input or output');
            $table->enum('status', ['pending', 'approved', 'completed'])->default('pending');
            $table->timestamp('requested_at');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->string('month')->comment('Format: YYYY-MM for quota tracking');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['employee_id', 'month']);
            $table->index(['type', 'status']);
            $table->index('requested_at');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallon_requests');
    }
};