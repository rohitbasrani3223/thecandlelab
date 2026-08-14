<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductSize extends Model
{
    use HasFactory;

    protected $table = 'sizes';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'slug',
        'unit',
        'value',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'size_id');
    }
}
