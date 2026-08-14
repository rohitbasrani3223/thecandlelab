<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SubCategory extends Model
{
    use HasFactory;

    protected $table = 'sub_categories';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'main_category_id',
        'name',
        'slug',
        'description',
        'image_url',
        'banner_desktop',
        'banner_mobile',
        'meta_title',
        'meta_description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
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

    public function mainCategory()
    {
        return $this->belongsTo(MainCategory::class, 'main_category_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'sub_category_id');
    }
}
