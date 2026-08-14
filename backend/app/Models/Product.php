<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'main_category_id',
        'sub_category_id',
        'name',
        'slug',
        'tagline',
        'sku',
        'price',
        'original_price',
        'short_description',
        'long_description',
        'product_details',
        'fragrance_pyramid',
        'top_notes',
        'heart_notes',
        'base_notes',
        'scent_profile',
        'wax_type',
        'wick_type',
        'burn_time',
        'burn_time_hours',
        'weight_grams',
        'how_to_use',
        'safety_instructions',
        'whats_included',
        'shipping_returns',
        'rating',
        'reviews_count',
        'status',
        'is_featured',
        'is_bestseller',
        'is_new_arrival',
        'is_trending',
        'is_limited_edition',
        'has_fragrance_option',
        'has_size_option',
        'has_color_option',
        'has_wick_option',
        'has_gift_packaging',
        'has_custom_message',
        'available_fragrance_ids',
        'available_size_ids',
        'available_color_ids',
        'available_wick_type_ids',
        'collection_ids',
        'meta_title',
        'meta_description',
        'meta_keywords',
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
        'is_limited_edition' => 'boolean',
        'has_fragrance_option' => 'boolean',
        'has_size_option' => 'boolean',
        'has_color_option' => 'boolean',
        'has_wick_option' => 'boolean',
        'has_gift_packaging' => 'boolean',
        'has_custom_message' => 'boolean',
        'available_fragrance_ids' => 'array',
        'available_size_ids' => 'array',
        'available_color_ids' => 'array',
        'available_wick_type_ids' => 'array',
        'collection_ids' => 'array',
        'product_details' => 'array',
        'fragrance_pyramid' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name) . '-' . Str::random(5);
            }
        });
    }

    public function mainCategory()
    {
        return $this->belongsTo(MainCategory::class, 'main_category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'product_collections', 'product_id', 'collection_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id')->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'product_id');
    }
}
