<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Fragrance extends Model
{
    use HasFactory;

    protected $table = 'fragrances';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'slug',
        'image_url',
        'short_description',
        'scent_profile',
        'top_notes',
        'heart_notes',
        'base_notes',
        'scent_family',
        'intensity',
        'is_active',
        'sort_order',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
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
                $model->slug = Str::slug($model->name) . '-' . Str::random(5);
            }
        });
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'fragrance_id');
    }
}
