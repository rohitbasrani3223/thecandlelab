<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MainCategory extends Model
{
    use HasFactory;

    protected $table = 'main_categories';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'slug',
        'description',
        'image_url',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'main_category_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'main_category_id');
    }
}
