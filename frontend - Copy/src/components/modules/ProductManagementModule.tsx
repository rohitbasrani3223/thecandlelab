"use client";

import React, { useState } from "react";
import { useStore, CandleProduct } from "@/context/StoreContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Search, Plus, Grid3X3, List, Download, Filter,
  Package, AlertTriangle, Flame, Edit3, Eye, Trash2,
  Star, CheckCircle2, X, Save, History, ToggleLeft, ToggleRight, CheckSquare, Square
} from "lucide-react";

const FONT = { fontFamily: "Inter, system-ui, sans-serif" };

export const ProductManagementModule: React.FC = () => {
  const { products, collections, addProduct, updateProduct, deleteProduct, showToast } = useStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [activeProduct, setActiveProduct] = useState<CandleProduct | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<CandleProduct>>({
    name: "",
    tagline: "",
    price: 799,
    originalPrice: 999,
    category: "Luxury Aromatherapy",
    collections: ["scented-candles"],
    waxType: "Soy Wax",
    wickType: "Wooden Crackling Wick",
    burnTimeHours: 50,
    weightGrams: 250,
    stock: 25,
    status: "Active",
    isBestSeller: false,
    isNewArrival: true,
    description: "",
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80"]
  });

  const filtered = products.filter((p) => {
    const matchSearch = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchColl = collectionFilter === "all" || p.collections.includes(collectionFilter);
    const matchStock = stockFilter === "all" ||
      (stockFilter === "low" && p.stock > 0 && p.stock <= 10) ||
      (stockFilter === "out" && p.stock === 0) ||
      (stockFilter === "in" && p.stock > 10);
    return matchSearch && matchColl && matchStock;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkStatusChange = (statusVal: "Active" | "Draft" | "Archived") => {
    selectedIds.forEach(id => {
      updateProduct(id, { status: statusVal });
    });
    showToast(`Updated ${selectedIds.length} products to ${statusVal}`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => {
      deleteProduct(id);
    });
    showToast(`Deleted ${selectedIds.length} products`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = ["ID,SKU,Name,Category,Price,Stock,Status,BestSeller,Created"];
    const rows = filtered.map(p => `${p.id},${p.sku || ''},"${p.name}",${p.category},${p.price},${p.stock},${p.status},${p.isBestSeller ? 'Yes' : 'No'},Today`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candlelab_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported Products Catalog to CSV 📊");
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast("Please fill in Product Name and Price");
      return;
    }
    addProduct({
      name: formData.name || "New Candle Product",
      slug: (formData.name || "new-candle").toLowerCase().replace(/\s+/g, '-'),
      tagline: formData.tagline || "",
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      images: formData.images && formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80"],
      category: formData.category || "Luxury Aromatherapy",
      collections: formData.collections || ["scented-candles"],
      waxType: (formData.waxType as any) || "Soy Wax",
      wickType: (formData.wickType as any) || "Wooden Crackling Wick",
      burnTimeHours: Number(formData.burnTimeHours || 50),
      weightGrams: Number(formData.weightGrams || 250),
      fragranceNotes: { top: ["Amber"], middle: ["Oud"], base: ["Vanilla"] },
      fragranceStrength: 4,
      roomSize: "Medium (Living Room)",
      careInstructions: ["Trim wooden wick to 1/4 inch"],
      ingredients: ["100% Soy Wax", "Essential Oils"],
      isVegan: true,
      isHandmade: true,
      isEcoFriendly: true,
      isBestSeller: formData.isBestSeller || false,
      isNewArrival: formData.isNewArrival || true,
      stock: Number(formData.stock || 25),
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      status: formData.status as any || "Active",
      sellerId: "s-1",
      sellerName: "The Candle Lab Atelier",
      description: formData.description || ""
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    updateProduct(activeProduct.id, formData);
    showToast(`Updated product "${activeProduct.name}" ✏️`);
    setIsEditModalOpen(false);
  };

  const handleOpenHistory = (p: CandleProduct) => {
    setActiveProduct(p);
    setAuditLogs([
      { id: 1, action: "Created", date: "Yesterday 14:20", by: "Admin (Master)", details: `Initial creation with price ₹${p.price}` },
      { id: 2, action: "Stock Adjustment", date: "Today 10:15", by: "Inventory Manager", details: `Stock set to ${p.stock} units` },
      { id: 3, action: "Status Verification", date: "Today 12:00", by: "System", details: `Verified status as ${p.status}` }
    ]);
    setIsHistoryModalOpen(true);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="danger" dot>Out of Stock</Badge>;
    if (stock <= 10) return <Badge variant="warning" dot>Low Stock ({stock})</Badge>;
    return <Badge variant="success" dot>In Stock ({stock})</Badge>;
  };

  const stats = [
    { label: "Total SKUs", value: products.length, icon: Package, color: "text-[#C8A75A]", bg: "bg-[#FAF7F2]" },
    { label: "Low Stock", value: products.filter(p => p.stock > 0 && p.stock <= 10).length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, icon: Flame, color: "text-red-500", bg: "bg-red-50" },
    { label: "Collections", value: collections.length, icon: Grid3X3, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div style={FONT} className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1F1F1F]">Products Atelier Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">{products.length} total products across {collections.length} active collections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={handleExportCSV}>Export CSV</Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => {
            setFormData({
              name: "", tagline: "", price: 799, originalPrice: 999, category: "Luxury Aromatherapy",
              collections: ["scented-candles"], waxType: "Soy Wax", wickType: "Wooden Crackling Wick",
              burnTimeHours: 50, weightGrams: 250, stock: 25, status: "Active", isBestSeller: false, isNewArrival: true, description: ""
            });
            setIsAddModalOpen(true);
          }}>Add New Product</Button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="sm" className="flex items-center gap-3 border border-[#E6DFD3]">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1F1F1F] leading-none">{s.value}</p>
                <p className="text-[11px] text-[#78716C] mt-1 font-medium">{s.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Filters & Bulk Action Bar ── */}
      <Card padding="sm" className="border border-[#E6DFD3]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by Product Name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs text-[#1F1F1F] placeholder-[#94A3B8] focus:outline-none focus:border-[#C8A75A] transition-all"
            />
          </div>

          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs font-medium text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
          >
            <option value="all">All Collections</option>
            {collections.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs font-medium text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
          >
            <option value="all">All Stock Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#FAF7F2] rounded-xl p-1 border border-[#E6DFD3] ml-auto">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#C8A75A] shadow-sm" : "text-[#78716C]"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-[#C8A75A] shadow-sm" : "text-[#78716C]"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E6DFD3] flex items-center justify-between bg-[#FAF7F2] p-2.5 rounded-xl">
            <span className="text-xs font-bold text-[#1F1F1F]">{selectedIds.length} Products Selected</span>
            <div className="flex gap-2">
              <Button size="xs" variant="secondary" onClick={() => handleBulkStatusChange("Active")}>Set Active</Button>
              <Button size="xs" variant="secondary" onClick={() => handleBulkStatusChange("Draft")}>Set Draft</Button>
              <Button size="xs" variant="danger" onClick={handleBulkDelete}>Delete Selected</Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Product List View ── */}
      {viewMode === "list" && (
        <Card padding="none" className="overflow-hidden border border-[#E6DFD3]">
          <div className="overflow-x-auto">
            <table className="w-full" style={FONT}>
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E6DFD3]">
                  <th className="px-3 py-3 w-10 text-center">
                    <button onClick={handleSelectAll} className="text-[#1F1F1F]">
                      {selectedIds.length > 0 && selectedIds.length === filtered.length ? <CheckSquare className="w-4 h-4 text-[#C8A75A]" /> : <Square className="w-4 h-4 text-[#94A3B8]" />}
                    </button>
                  </th>
                  {["Product Details", "SKU", "Price", "Stock", "Category", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-[#1F1F1F] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-xs text-[#78716C]">No products found matching search criteria</td></tr>
                ) : filtered.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr key={p.id} className={`hover:bg-[#FAF7F2]/50 transition-colors ${isSelected ? "bg-[#FAF7F2]" : ""}`}>
                      <td className="px-3 py-3.5 text-center">
                        <button onClick={() => handleToggleSelect(p.id)}>
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[#C8A75A]" /> : <Square className="w-4 h-4 text-[#94A3B8]" />}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E6DFD3] bg-white shrink-0">
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=80&q=60"; }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F1F1F] truncate max-w-[200px]">{p.name}</p>
                            <p className="text-[10px] text-[#78716C]">{p.waxType} • {p.weightGrams}g</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono font-bold text-[#78716C]">{p.sku || `SKU-${p.id}`}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#1F1F1F]">₹{p.price.toLocaleString()}</span>
                          {p.originalPrice && <span className="text-[10px] line-through text-[#94A3B8]">₹{p.originalPrice}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{getStockBadge(p.stock)}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-[#1F1F1F]">{p.category}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            const newStatus = p.status === "Active" ? "Draft" : "Active";
                            updateProduct(p.id, { status: newStatus as any });
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-[#1F1F1F] hover:text-[#C8A75A]"
                        >
                          {p.status === "Active" ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="neutral">Draft</Badge>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            title="View Details"
                            onClick={() => { setActiveProduct(p); setIsViewModalOpen(true); }}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C8A75A] hover:bg-[#FAF7F2]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Edit Product"
                            onClick={() => {
                              setActiveProduct(p);
                              setFormData(p);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C8A75A] hover:bg-[#FAF7F2]"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            title="Audit History"
                            onClick={() => handleOpenHistory(p)}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C8A75A] hover:bg-[#FAF7F2]"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            title="Delete Product"
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                            }}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-red-600 hover:bg-red-50"
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
          <div className="px-4 py-3 border-t border-[#E6DFD3] flex items-center justify-between">
            <p className="text-xs text-[#78716C]">Showing {filtered.length} of {products.length} Products</p>
          </div>
        </Card>
      )}

      {/* ── Product Grid View ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} padding="none" hover className="overflow-hidden border border-[#E6DFD3] group">
              <div className="aspect-square bg-[#FAF7F2] relative overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&q=70"; }} />
                <div className="absolute top-2 left-2">{getStockBadge(p.stock)}</div>
                {p.isBestSeller && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="warning">Bestseller</Badge>
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <p className="text-xs font-bold text-[#1F1F1F] truncate">{p.name}</p>
                <p className="text-[10px] text-[#78716C] mt-0.5">{p.waxType} • {p.weightGrams}g</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-[#1F1F1F]">₹{p.price.toLocaleString()}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#C8A75A]">
                    <Star className="w-3 h-3 fill-[#C8A75A]" />{p.rating}
                  </span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <Button variant="secondary" size="xs" className="flex-1" leftIcon={<Edit3 className="w-3 h-3" />} onClick={() => { setActiveProduct(p); setFormData(p); setIsEditModalOpen(true); }}>Edit</Button>
                  <Button variant="ghost" size="xs" leftIcon={<Eye className="w-3 h-3" />} onClick={() => { setActiveProduct(p); setIsViewModalOpen(true); }}>View</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-[#C8A75A]/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#E6DFD3] flex items-center justify-between bg-[#FAF7F2]">
              <h2 className="font-serif font-bold text-base text-[#1F1F1F]">
                {isAddModalOpen ? "Create New Luxury Candle" : `Edit Product: ${activeProduct?.name}`}
              </h2>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-[#78716C] hover:text-[#1F1F1F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={formData.tagline || ""}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock ?? 25}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Category *</label>
                  <input
                    type="text"
                    value={formData.category || "Luxury Aromatherapy"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Wax Type</label>
                  <select
                    value={formData.waxType || "Soy Wax"}
                    onChange={(e) => setFormData({ ...formData, waxType: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  >
                    <option value="Soy Wax">Soy Wax</option>
                    <option value="Beeswax">Beeswax</option>
                    <option value="Coconut Wax">Coconut Wax</option>
                    <option value="Paraffin Blend">Paraffin Blend</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Wick Type</label>
                  <select
                    value={formData.wickType || "Wooden Crackling Wick"}
                    onChange={(e) => setFormData({ ...formData, wickType: e.target.value as any })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  >
                    <option value="Wooden Crackling Wick">Wooden Crackling Wick</option>
                    <option value="Cotton Wick">Cotton Wick</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Burn Time (Hours)</label>
                  <input
                    type="number"
                    value={formData.burnTimeHours || 50}
                    onChange={(e) => setFormData({ ...formData, burnTimeHours: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Weight (Grams)</label>
                  <input
                    type="number"
                    value={formData.weightGrams || 250}
                    onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.images ? formData.images[0] : ""}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#1F1F1F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller || false}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-[#C8A75A] w-4 h-4"
                    />
                    Featured Best Seller
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-[#1F1F1F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival || false}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-[#C8A75A] w-4 h-4"
                    />
                    New Arrival
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#1F1F1F] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl p-2.5 text-xs text-[#1F1F1F] focus:outline-none focus:border-[#C8A75A]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6DFD3] flex justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  {isAddModalOpen ? "Save & Publish" : "Update Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Product View Modal ── */}
      {isViewModalOpen && activeProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border-2 border-[#C8A75A]/40 shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1F1F1F]">{activeProduct.name}</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-[#78716C]"><X className="w-5 h-5" /></button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E6DFD3]">
              <img src={activeProduct.images[0]} alt={activeProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 text-xs">
              <p><strong className="text-[#1F1F1F]">Tagline:</strong> {activeProduct.tagline || '—'}</p>
              <p><strong className="text-[#1F1F1F]">Price:</strong> ₹{activeProduct.price} (SKU: {activeProduct.sku || '—'})</p>
              <p><strong className="text-[#1F1F1F]">Wax & Wick:</strong> {activeProduct.waxType} • {activeProduct.wickType}</p>
              <p><strong className="text-[#1F1F1F]">Burn Time & Weight:</strong> {activeProduct.burnTimeHours} hrs • {activeProduct.weightGrams}g</p>
              <p><strong className="text-[#1F1F1F]">Stock:</strong> {activeProduct.stock} units ({activeProduct.status})</p>
              <p className="text-[#78716C] pt-2 border-t border-[#E6DFD3]">{activeProduct.description || 'Handcrafted luxury aromatherapy candle.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── History Audit Modal ── */}
      {isHistoryModalOpen && activeProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border-2 border-[#C8A75A]/40 shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1F1F1F]">Audit History</h3>
                <p className="text-[10px] text-[#78716C]">{activeProduct.name}</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-[#78716C]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#FAF7F2] border border-[#E6DFD3] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#1F1F1F]">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-[#94A3B8] font-normal">{log.date}</span>
                  </div>
                  <p className="text-[#78716C] text-[11px]">{log.details}</p>
                  <p className="text-[10px] text-[#C8A75A] font-medium">By: {log.by}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

