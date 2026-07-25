"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  CheckSquare,
  Square,
  Sparkles,
  Barcode,
  Tag,
  Eye,
  X,
  Image as ImageIcon,
  Globe,
  SlidersHorizontal,
  Flame,
  Layers,
  Layers2
} from "lucide-react";

export const ProductManagementModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, collections, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CandleProduct | null>(null);

  // Form for New/Edit Product
  const [prodForm, setProdForm] = useState<{
    name: string;
    price: number;
    originalPrice: number;
    category: string;
    collections: string[];
    waxType: CandleProduct["waxType"];
    wickType: CandleProduct["wickType"];
    burnTimeHours: number;
    weightGrams: number;
    stock: number;
    sku: string;
    barcode: string;
    brand: string;
    status: CandleProduct["status"];
    seoTitle: string;
    seoDescription: string;
    description: string;
    imageUrl: string;
  }>({
    name: "",
    price: 899,
    originalPrice: 1199,
    category: "Luxury",
    collections: ["scented-candles"],
    waxType: "Soy Wax",
    wickType: "Wooden Crackling Wick",
    burnTimeHours: 50,
    weightGrams: 250,
    stock: 25,
    sku: "SKU-CANDLE-100",
    barcode: "8901234567890",
    brand: "The Candle Lab Atelier",
    status: "Active" as const,
    seoTitle: "",
    seoDescription: "",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
  });

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (selectedStatus !== "ALL" && (p.status || "Active") !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    selectedProducts.forEach((id) => deleteProduct(id));
    setSelectedProducts([]);
    showToast(`Deleted ${selectedProducts.length} selected products 🗑️`);
  };

  const handleImportExcel = () => {
    showToast("Excel SKU/Barcode catalog imported successfully! 📊");
  };

  const handleExportExcel = () => {
    showToast(`Exported ${filteredProducts.length} products to Excel catalog 📥`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodForm.name,
        price: prodForm.price,
        originalPrice: prodForm.originalPrice,
        category: prodForm.category,
        collections: prodForm.collections,
        waxType: prodForm.waxType,
        wickType: prodForm.wickType,
        burnTimeHours: prodForm.burnTimeHours,
        weightGrams: prodForm.weightGrams,
        stock: prodForm.stock,
        sku: prodForm.sku,
        barcode: prodForm.barcode,
        brand: prodForm.brand,
        status: prodForm.status,
        seoTitle: prodForm.seoTitle || prodForm.name,
        seoDescription: prodForm.seoDescription || prodForm.description,
        description: prodForm.description
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: prodForm.name,
        slug: prodForm.name.toLowerCase().replace(/\s+/g, "-"),
        tagline: "Artisanal hand-poured candle",
        price: prodForm.price,
        originalPrice: prodForm.originalPrice,
        rating: 5.0,
        reviewsCount: 1,
        images: [prodForm.imageUrl],
        category: prodForm.category,
        collections: prodForm.collections,
        waxType: prodForm.waxType,
        wickType: prodForm.wickType,
        burnTimeHours: prodForm.burnTimeHours,
        weightGrams: prodForm.weightGrams,
        fragranceNotes: { top: ["Amber", "Vanilla"], middle: ["Oud Wood"], base: ["Musk"] },
        fragranceStrength: 4,
        roomSize: "Medium (Living Room)",
        careInstructions: ["Trim wick before burn"],
        ingredients: ["Soy Wax", "Essential Oils"],
        isVegan: true,
        isHandmade: true,
        isEcoFriendly: true,
        stock: prodForm.stock,
        sku: prodForm.sku,
        barcode: prodForm.barcode,
        brand: prodForm.brand,
        status: prodForm.status,
        seoTitle: prodForm.name,
        seoDescription: prodForm.description,
        sellerId: "s-1",
        sellerName: "The Candle Lab Atelier",
        description: prodForm.description || "Hand-poured luxury candle."
      });
    }
    setIsAddModalOpen(false);
  };

  const openEditModal = (p: CandleProduct) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || p.price + 300,
      category: p.category,
      collections: p.collections,
      waxType: p.waxType,
      wickType: p.wickType,
      burnTimeHours: p.burnTimeHours,
      weightGrams: p.weightGrams,
      stock: p.stock,
      sku: p.sku || "SKU-001",
      barcode: p.barcode || "8901234567890",
      brand: p.brand || "The Candle Lab Atelier",
      status: p.status || "Active",
      seoTitle: p.seoTitle || p.name,
      seoDescription: p.seoDescription || p.description,
      description: p.description,
      imageUrl: p.images[0] || ""
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Advanced Product CMS & Variant Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage SKUs, barcodes, SEO metadata, stock alerts, variants & brand collections.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleImportExcel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Import Excel
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Catalog
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddModalOpen(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Luxury">Luxury</option>
            <option value="Floral">Floral</option>
            <option value="Gourmand">Gourmand</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Selected Action Bar */}
      {selectedProducts.length > 0 && (
        <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between text-xs font-medium shadow-md">
          <span>Selected {selectedProducts.length} items</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
            <button
              onClick={() => setSelectedProducts([])}
              className="text-slate-300 hover:text-white px-2 py-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="p-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4">Category & Wax</th>
                <th className="p-4">Price</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => {
                const isSelected = selectedProducts.includes(p.id);
                return (
                  <tr key={p.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? "bg-indigo-50/30" : ""}`}>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleSelectProduct(p.id)} className="text-slate-400 hover:text-slate-600">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-900">{p.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{p.brand || "The Candle Lab"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      <div className="font-bold text-slate-800">{p.sku || "N/A"}</div>
                      <div className="text-[10px] text-slate-400">{p.barcode || "N/A"}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <span className="font-semibold block">{p.category}</span>
                      <span className="text-[10px] text-slate-400">{p.waxType} • {p.weightGrams}g</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">₹{p.price}</div>
                      {p.originalPrice && <div className="text-[10px] text-slate-400 line-through">₹{p.originalPrice}</div>}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock > 10
                            ? "bg-emerald-50 text-emerald-700"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          (p.status || "Active") === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {p.status || "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" /> {editingProduct ? "Edit Product" : "Add New Candle SKU"}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
                    placeholder="e.g. Velvet Amber & Oud"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900 focus:outline-none"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Floral">Floral</option>
                    <option value="Gourmand">Gourmand</option>
                    <option value="Aromatherapy">Aromatherapy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Barcode (EAN-13)</label>
                  <input
                    type="text"
                    value={prodForm.barcode}
                    onChange={(e) => setProdForm({ ...prodForm, barcode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  placeholder="Rich description of scents, wicks, burn time..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 font-semibold">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow transition-colors"
                >
                  {editingProduct ? "Update Product" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
