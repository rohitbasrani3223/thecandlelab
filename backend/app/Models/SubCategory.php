<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function mainCategory()
    {
        return $this->belongsTo(MainCategory::class, 'main_category_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'sub_category_id');
    }
}
