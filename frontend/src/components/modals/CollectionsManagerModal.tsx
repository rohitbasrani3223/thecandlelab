"use client";

import React, { useState } from "react";
import { useStore, CollectionItem } from "@/context/StoreContext";
import { Layers, Plus, Trash2, Edit3, X, Check, Sparkles, Image as ImageIcon } from "lucide-react";

interface CollectionsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollectionsManagerModal: React.FC<CollectionsManagerModalProps> = ({ isOpen, onClose }) => {
  const { collections, addCollection, updateCollection, deleteCollection } = useStore();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    bannerImage: "",
    iconSymbol: "🕯️",
    isFeatured: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    if (isEditing) {
      updateCollection(isEditing, { ...formData, slug });
      setIsEditing(null);
    } else {
      addCollection({ ...formData, slug });
    }

    setFormData({
      name: "",
      slug: "",
      description: "",
      bannerImage: "",
      iconSymbol: "🕯️",
      isFeatured: true
    });
  };

  const handleStartEdit = (col: CollectionItem) => {
    setIsEditing(col.id);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description,
      bannerImage: col.bannerImage,
      iconSymbol: col.iconSymbol || "🕯️",
      isFeatured: col.isFeatured || false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-brand-surface rounded-2xl border-2 border-brand-gold shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6 border-b border-brand-beige pb-4">
          <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-brand-charcoal">COLLECTIONS CONTROL CENTER</h3>
            <p className="text-xs text-brand-earth">Add, Edit & Delete dynamic store collections synchronized across Storefront, Nav & Filters</p>
          </div>
        </div>

        {/* Create / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-brand-gold/40 shadow-sm mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              {isEditing ? "Edit Collection" : "Create New Collection"}
            </span>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setFormData({ name: "", slug: "", description: "", bannerImage: "", iconSymbol: "🕯️", isFeatured: true });
                }}
                className="text-xs text-brand-earth underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-brand-earth block mb-1">Collection Name *</label>
              <input
                type="text"
                placeholder="e.g. Royal Jasmine & Blossom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-earth block mb-1">Icon Symbol (Emoji)</label>
              <input
                type="text"
                placeholder="🌸, 🕯️, 🍦, ☕"
                value={formData.iconSymbol}
                onChange={(e) => setFormData({ ...formData, iconSymbol: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-earth block mb-1">Banner Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.bannerImage}
                onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                className="w-full text-xs p-2 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-earth block mb-1">Description</label>
            <input
              type="text"
              placeholder="Short catchy collection summary for customer showcase..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-brand-beige focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-brand-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded text-brand-gold focus:ring-brand-gold"
              />
              Show on Homepage Featured Collections Showcase
            </label>

            <button
              type="submit"
              className="bg-brand-charcoal text-brand-gold px-5 py-2 rounded-xl text-xs font-bold hover:bg-brand-gold hover:text-brand-charcoal transition-colors flex items-center gap-1.5 shadow"
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {isEditing ? "Save Changes" : "Add Collection"}
            </button>
          </div>
        </form>

        {/* Existing Collections List */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-3">
          All Active Collections ({collections.length}):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white p-3 rounded-xl border border-brand-beige flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{col.iconSymbol || "🕯️"}</span>
                <div>
                  <h5 className="font-serif text-xs font-bold text-brand-charcoal flex items-center gap-2">
                    {col.name}
                    {col.isFeatured && (
                      <span className="text-[9px] bg-brand-gold/20 text-brand-earth px-1.5 py-0.2 rounded font-sans">
                        Featured
                      </span>
                    )}
                  </h5>
                  <p className="text-[10px] text-brand-earth line-clamp-1">{col.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(col)}
                  className="p-1.5 text-brand-charcoal hover:text-brand-gold hover:bg-brand-beige rounded-lg"
                  title="Edit Collection"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCollection(col.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Collection"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
