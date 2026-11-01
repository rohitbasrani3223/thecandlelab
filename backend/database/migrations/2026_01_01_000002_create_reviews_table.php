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
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('product_id')->index();
                $table->string('product_name')->nullable();
                $table->string('customer_name');
                $table->string('customer_email')->nullable();
                $table->string('customer_location')->nullable();
                $table->unsignedTinyInteger('rating')->default(5);
                $table->string('title');
                $table->text('comment');
                $table->string('scent_throw')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->index();
                $table->boolean('is_verified_buyer')->default(false);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
