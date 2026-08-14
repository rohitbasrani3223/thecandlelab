<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductVariant extends Model
{
    use HasFactory;

    protected $table = 'product_variants';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'product_id',
        'sku',
        'title',
        'fragrance_id',
        'fragrance_name',
        'size_id',
        'size_name',
        'color_id',
        'color_name',
        'color_code',
        'wick_type_id',
        'wick_type_name',
        'price',
        'original_price',
        'cost_price',
        'stock',
        'low_stock_threshold',
        'image_url',
        'is_default',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'stock' => 'integer',
        'low_stock_threshold' => 'integer',
        'is_default' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
            if (empty($model->sku)) {
                $model->sku = 'SKU-' . strtoupper(Str::random(8));
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function fragrance()
    {
        return $this->belongsTo(Fragrance::class, 'fragrance_id');
    }

    public function size()
    {
        return $this->belongsTo(ProductSize::class, 'size_id');
    }

    public function color()
    {
        return $this->belongsTo(ProductColor::class, 'color_id');
    }

    public function wickType()
    {
        return $this->belongsTo(WickType::class, 'wick_type_id');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'variant_id');
    }
}
