<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_number')->unique();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('customer_name');
                $table->string('customer_email');
                $table->string('customer_phone')->nullable();
                $table->decimal('subtotal', 10, 2);
                $table->decimal('shipping_fee', 10, 2)->default(0);
                $table->decimal('discount_amount', 10, 2)->default(0);
                $table->decimal('total_amount', 10, 2);
                $table->string('status')->default('Processing');
                $table->string('payment_method')->default('UPI');
                $table->string('payment_status')->default('Pending');
                $table->json('shipping_address');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
                $table->unsignedBigInteger('product_id')->nullable();
                $table->string('product_name');
                $table->string('product_sku')->nullable();
                $table->decimal('price', 10, 2);
                $table->integer('quantity');
                $table->decimal('subtotal', 10, 2);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
