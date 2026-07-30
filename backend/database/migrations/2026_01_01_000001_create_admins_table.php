<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('admins')) {
            Schema::create('admins', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('full_name', 100);
                $table->string('email', 255)->unique();
                $table->string('phone', 15)->unique();
                $table->string('password_hash', 255);
                $table->string('role', 50)->default('ADMIN');
                $table->string('status', 20)->default('ACTIVE');
                $table->string('avatar', 500)->nullable();
                $table->timestamp('last_login')->nullable();
                $table->integer('login_count')->default(0);
                $table->uuid('created_by')->nullable();
                $table->uuid('updated_by')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
