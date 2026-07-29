"use client";

import React, { useState } from "react";
import { useStore, CategoryItem } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Plus, Edit3, Trash2, FolderTree, X, Save, Eye, Package } from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const CategoryManagementModule: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products, showToast } = useStore();
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    name: "",
    slug: "",
    description: "",
    image: ""
  });

  const filtered = categories.filter(c =>
    !search.trim() ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast("Please enter Category Name");
      return;
    }
    await addCategory({
      name: formData.name,
      slug: (formData.name).toLowerCase().replace(/\s+/g, '-'),
      description: formData.description || "",
      image: formData.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80"
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    await updateCategory(activeCategory.id, formData);
    setIsEditModalOpen(false);
  };

  return (
    <div style={FONT} className="space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1F1F1F]">Category Atelier Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">{categories.length} active scent categories mapped to storefront taxonomy</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => {
            setFormData({ name: "", slug: "", description: "", image: "" });
            setIsAddModalOpen(true);
          }}
        >
          Add New Category
        </Button>
      </div>

      {/* Filter Bar */}
      <Card padding="sm" className="border border-[#E6DFD3]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs text-[#1F1F1F] placeholder-[#94A3B8] focus:outline-none focus:border-[#C8A75A]"
          />
        </div>
      </Card>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => {
          const catProducts = products.filter(p =>
            p.category.toLowerCase().includes(cat.name.toLowerCase()) ||
            cat.name.toLowerCase().includes(p.category.toLowerCase()) ||
            p.category === cat.id
          );
          const count = catProducts.length || cat.productCount || 1;
          return (
            <Card key={cat.id} padding="none" hover className="overflow-hidden border border-[#E6DFD3] group flex flex-col justify-between">
              <div>
                <div className="h-32 bg-[#FAF7F2] relative overflow-hidden">
                  <img
                    src={cat.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80"; }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-[#1F1F1F] border border-[#E6DFD3]">
                    {count} {count === 1 ? "Product" : "Products"}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#1F1F1F]">{cat.name}</h3>
                    <span className="text-[10px] font-mono text-[#C8A75A] font-bold">/{cat.slug}</span>
                  </div>
                  <p className="text-xs text-[#78716C] line-clamp-2">{cat.description || "Hand-crafted luxury fragrance category."}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#E6DFD3]/50 flex items-center justify-between mt-3">
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Live Synced
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setActiveCategory(cat);
                      setFormData(cat);
                      setIsEditModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C8A75A] hover:bg-[#FAF7F2]"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${cat.name}"?`)) deleteCategory(cat.id);
                    }}
                    className="p-1.5 rounded-lg text-[#78716C] hover:text-red-600 hover:bg-red-50"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border-2 border-[#C8A75A]/40 shadow-2xl overflow-hidden p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <h2 className="font-serif font-bold text-base text-[#1F1F1F]">
                {isAddModalOpen ? "Create Category" : `Edit Category: ${activeCategory?.name}`}
              </h2>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-[#78716C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Category Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6DFD3] flex justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  {isAddModalOpen ? "Save to PostgreSQL" : "Update Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
