<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class WickType extends Model
{
    use HasFactory;

    protected $table = 'wick_types';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'description',
        'additional_price',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'additional_price' => 'decimal:2',
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
        });
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'wick_type_id');
    }
}
