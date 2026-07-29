<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'original_price',
        'category_id',
        'images',
        'thumbnail',
        'rating',
        'review_count',
        'stock',
        'sku',
        'weight',
        'size',
        'burn_time',
        'wax_type',
        'fragrance',
        'is_featured',
        'is_bestseller',
        'is_new_arrival',
        'is_trending',
        'is_active',
        'tags',
    ];

    protected $casts = [
        'images' => 'array',
        'tags' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_new_arrival' => 'boolean',
        'is_trending' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
