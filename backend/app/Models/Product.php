<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'main_category_id',
        'sub_category_id',
        'collection_id',
        'name',
        'slug',
        'tagline',
        'sku',
        'price',
        'original_price',
        'image_url',
        'thumbnail',
        'short_description',
        'long_description',
        'top_notes',
        'heart_notes',
        'base_notes',
        'wax_type',
        'wick_type',
        'burn_time_hours',
        'weight_grams',
        'rating',
        'reviews_count',
        'status',
        'is_featured',
        'is_bestseller',
        'is_new_arrival',
        'is_trending',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'burn_time_hours' => 'integer',
        'weight_grams' => 'integer',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_new_arrival' => 'boolean',
        'is_trending' => 'boolean',
    ];

    public function mainCategory()
    {
        return $this->belongsTo(MainCategory::class, 'main_category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class, 'collection_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'product_id');
    }
}
