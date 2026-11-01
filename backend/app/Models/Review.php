<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'product_id',
        'product_name',
        'customer_name',
        'customer_email',
        'customer_location',
        'rating',
        'title',
        'comment',
        'scent_throw',
        'status',
        'is_verified_buyer',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified_buyer' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function ($review) {
            if (empty($review->id)) {
                $review->id = (string) Str::uuid();
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
