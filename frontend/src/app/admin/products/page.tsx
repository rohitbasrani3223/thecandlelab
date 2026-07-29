"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  Flame,
  Upload,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: CATEGORIES[0].id,
    stock: "20",
    sku: "",
    fragrance: "",
    burnTime: "50 hours",
    waxType: "100% Natural Soy Wax",
    isBestSeller: false,
    isNewArrival: true,
  });

  const filtered = productList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category.id === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      category: CATEGORIES[0].id,
      stock: "20",
      sku: `TCL-${Math.floor(100 + Math.random() * 900)}`,
      fragrance: "",
      burnTime: "50 hours",
      waxType: "100% Natural Soy Wax",
      isBestSeller: false,
      isNewArrival: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product: typeof PRODUCTS[0]) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      category: product.category.id,
      stock: product.stock.toString(),
      sku: product.sku || "",
      fragrance: product.fragrance || "",
      burnTime: product.burnTime || "50 hours",
      waxType: product.waxType || "100% Natural Soy Wax",
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival),
    });
    setShowModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in Product Name and Price");
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === formData.category) || CATEGORIES[0];

    if (editingId) {
      // Edit existing product
      setProductList(
        productList.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: formData.name,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice || formData.price),
                category: catObj,
                stock: Number(formData.stock),
                sku: formData.sku,
                fragrance: formData.fragrance,
                burnTime: formData.burnTime,
                waxType: formData.waxType,
                isBestSeller: formData.isBestSeller,
                isNewArrival: formData.isNewArrival,
              }
            : p
        )
      );
      toast.success("Product updated successfully! ✨");
    } else {
      // Add new product
      const newProd: typeof PRODUCTS[0] = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/ /g, "-"),
        description: `${formData.name} handcrafted with ${formData.fragrance || "essential oils"}.`,
        shortDescription: `${formData.name} luxury candle.`,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        category: catObj,
        stock: Number(formData.stock),
        sku: formData.sku,
        fragrance: formData.fragrance,
        burnTime: formData.burnTime,
        waxType: formData.waxType,
        rating: 5.0,
        reviewCount: 0,
        isFeatured: true,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        isTrending: true,
        images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800"],
        thumbnail: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600",
        weight: 350,
        size: "250g",
        tags: ["candle", "luxury"],
        discountPercent: formData.originalPrice ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100) : 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProductList([newProd, ...productList]);
      toast.success("New product added to store! 🕯️");
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this candle?")) {
      setProductList(productList.filter((p) => p.id !== id));
      toast.success("Product deleted from database");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-medium text-[#F5EFE4]"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Products Management
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">
            Manage candle catalog, stock levels, variants, and pricing. ({filtered.length} total)
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn btn-gold btn-sm gap-1.5 self-start sm:self-auto shadow-lg shadow-[#C4964A]/20"
          id="admin-new-product"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355]"
          />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#140D07] border border-[#2A1D13] text-[#F5EFE4] placeholder-[#8B7355] focus:outline-none focus:border-[#C4964A]"
            id="admin-product-search"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-[#140D07] border border-[#2A1D13] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
          id="admin-category-filter"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div
        className="rounded-2xl border border-[#2A1D13] overflow-hidden"
        style={{ background: "#140D07" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="border-b border-[#2A1D13] text-[11px] uppercase tracking-wider text-[#8B7355]"
                style={{ background: "#1A1208" }}
              >
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock Status</th>
                <th className="p-4 font-semibold">Badges</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1D13] text-xs">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#1F140B] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#2A1D13] border border-[#3A281A] flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-[#F5EFE4]">{product.name}</p>
                        <p className="text-[10px] font-mono text-[#8B7355]">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#A08060]">{product.category.name}</td>
                  <td className="p-4 font-semibold text-[#F5EFE4]">
                    {formatPrice(product.price)}
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-[#8B7355] line-through ml-1.5">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        background:
                          product.stock === 0
                            ? "rgba(239,68,68,0.15)"
                            : product.stock <= 5
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(34,197,94,0.15)",
                        color:
                          product.stock === 0
                            ? "#F87171"
                            : product.stock <= 5
                            ? "#FBBF24"
                            : "#4ADE80",
                      }}
                    >
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} units left`}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.isBestSeller && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#C4964A]/20 text-[#C4964A]">
                          Bestseller
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 rounded-xl text-[#8B7355] hover:text-[#C4964A] hover:bg-[#2A1D13] transition-colors border border-transparent hover:border-[#3A281A]"
                        title="Edit Product"
                        id={`edit-prod-${product.id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-xl text-[#8B7355] hover:text-red-400 hover:bg-red-950/20 transition-colors border border-transparent hover:border-red-900/30"
                        title="Delete Product"
                        id={`delete-prod-${product.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-[#140D07] border border-[#2A1D13] rounded-3xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A1D13]">
                <h3 className="text-xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                  {editingId ? "Edit Candle Product" : "Add New Candle Product"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-[#8B7355] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A08060] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Velvet Amber & Oud Candle"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A08060] mb-1">Sale Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="1499"
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A08060] mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="1899"
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A08060] mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A08060] mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A08060] mb-1">Fragrance Notes</label>
                  <input
                    type="text"
                    value={formData.fragrance}
                    onChange={(e) => setFormData({ ...formData, fragrance: e.target.value })}
                    placeholder="e.g. Amber, Sandalwood & Cardamom"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A08060] mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A08060] mb-1">Burn Time</label>
                    <input
                      type="text"
                      value={formData.burnTime}
                      onChange={(e) => setFormData({ ...formData, burnTime: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#1F140B] border border-[#3A281A] text-[#F5EFE4] focus:outline-none focus:border-[#C4964A]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-[#F5EFE4] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-[#C4964A]"
                    />
                    Mark as Bestseller
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#F5EFE4] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-[#C4964A]"
                    />
                    Mark as New Arrival
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#2A1D13]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold flex-1 justify-center">
                    {editingId ? "Update Product" : "Publish Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
