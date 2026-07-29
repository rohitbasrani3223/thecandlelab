"use client";

import { useState } from "react";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/data/mock";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-[#F5EFE4]" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>
            Categories Management
          </h1>
          <p className="text-xs text-[#8B7355] mt-1">Organize candles into collections and categories.</p>
        </div>
        <button onClick={() => toast.success("New category popup opened")} className="btn btn-gold btn-sm gap-1.5 self-start sm:self-auto">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="p-5 rounded-2xl border border-[#2A1D13] flex flex-col justify-between" style={{ background: "#140D07" }}>
            <div className="flex items-center gap-4 mb-4">
              <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-xl object-cover bg-[#2A1D13]" />
              <div>
                <h3 className="font-semibold text-[#F5EFE4] text-base">{cat.name}</h3>
                <p className="text-xs text-[#8B7355]">{cat.productCount} active products</p>
              </div>
            </div>
            <p className="text-xs text-[#A08060] line-clamp-2 mb-4">{cat.description}</p>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#2A1D13]">
              <button onClick={() => toast.success(`Editing ${cat.name}`)} className="p-1.5 rounded-lg text-[#8B7355] hover:text-[#C4964A] hover:bg-[#2A1D13]">
                <Edit size={14} />
              </button>
              <button onClick={() => toast.error("Category cannot be deleted while containing products")} className="p-1.5 rounded-lg text-[#8B7355] hover:text-red-400 hover:bg-red-900/20">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
