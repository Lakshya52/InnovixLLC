"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Filter,
  MoreVertical,
  Search,
  AlertTriangle,
  Eye,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Package,
  TrendingUp,
  Activity,
  Edit2,
  Trash2,
  Key
} from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "@/actions/inventory";

interface InventoryKey {
  id: string;
  productId: string;
  keyValue: string;
  isSold: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  status: string;
  iconVariant: string | null;
  stockKeys: InventoryKey[];
  updatedAt: string;
}

interface Log {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function InventoryClient({
  initialProducts,
  initialLogs
}: {
  initialProducts: Product[],
  initialLogs: Log[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState("All Software");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesFilter = filter === "All Software" || p.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, searchQuery]);

  const stats = {
    totalInventory: products.reduce((acc, p) => acc + p.stockKeys.length, 0),
    activeListings: products.filter(p => p.status === 'Live').length,
    lowStock: products.filter(p => p.stockKeys.length < 10).length
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err: any) {
        alert(err.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="p-8 mx-auto w-full max-w-[1400px]">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Product <span className="text-[#6eDD86]">Inventory</span></h1>
          <p className="text-[#a0a0a0] text-sm">Manage digital license keys and product listings for the enterprise software catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#222] transition-all cursor-pointer">
            <Filter size={18} />
            Filters
          </button>
          <Link
            href="/admin/inventory/keys"
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#222] transition-all cursor-pointer"
          >
            <Key size={18} className="text-[#6eDD86]" />
            Manage Keys
          </Link>
          <Link
            href="/admin/inventory/new"
            className="flex items-center gap-2 bg-[#6eDD86] text-black px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#5dbb72] transition-all cursor-pointer shadow-[0_0_20px_rgba(110,221,134,0.2)]"
          >
            <Plus size={18} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-[#6eDD86]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Inventory</p>
              <h3 className="text-4xl font-bold">{stats.totalInventory.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-2xl text-[#6eDD86] shadow-[0_0_15px_rgba(110,221,134,0.1)]">
              <Package size={24} />
            </div>
          </div>
          <p className="text-[#6eDD86] text-xs font-bold flex items-center gap-1">
            <TrendingUp size={14} /> +12.4% from last month
          </p>
        </div>

        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Listings</p>
              <h3 className="text-4xl font-bold">{stats.activeListings}</h3>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-2xl text-yellow-500">
              <Eye size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold italic">
            Currently live on store
          </p>
        </div>

        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-red-500/50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Low Stock Alerts</p>
              <h3 className="text-4xl font-bold text-white">{String(stats.lowStock).padStart(2, '0')}</h3>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-2xl text-red-500">
              <AlertTriangle size={24} />
            </div>
          </div>
          <p className="text-red-500/80 text-xs font-bold">
            Requires immediate attention
          </p>
        </div>
      </div>

      {/* Main Catalog Container */}
      <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-8 mb-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Product Catalog</h2>
          <div className="flex bg-[#0d0d0d] p-1.5 rounded-2xl border border-[#1f1f1f]">
            {["All Software", "OS", "Office", "Security"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filter === cat ? 'bg-[#1a1a1a] text-[#6eDD86]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Stock Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Listing Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {filteredProducts.map((p) => {
                const stockCount = p.stockKeys.length;
                const progressWidth = Math.min(100, (stockCount / 500) * 100);

                return (
                  <tr key={p.id} className="group hover:bg-[#1a1a1a]/30 transition-all">
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-[#2a2a2a] relative overflow-hidden">
                          <Monitor size={24} className="text-[#6eDD86]/50" />
                        </div>
                        <div>
                          <p className="font-bold text-[#e2e2e2] text-lg leading-tight">{p.name}</p>
                          <p className="text-[10px] text-gray-600 font-medium uppercase tracking-tight mt-1">{p.description?.slice(0, 50) || 'Full Retail License • Global'}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <p className="text-xl font-bold text-[#6eDD86]">${p.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-8">
                      <div className="max-w-[140px]">
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-[10px] font-bold text-gray-400">
                            {stockCount} keys <span className="text-[#6eDD86]/60 ml-1">{stockCount > 50 ? '85%' : stockCount > 0 ? 'Low' : 'Empty'}</span>
                          </p>
                        </div>
                        <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 shadow-[0_0_8px] ${stockCount > 50 ? 'bg-[#6eDD86] shadow-[#6eDD86]/20' :
                              stockCount > 0 ? 'bg-yellow-500 shadow-yellow-500/20' : 'bg-red-500 shadow-red-500/20'
                              }`}
                            style={{ width: `${progressWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${p.status === 'Live' ? 'border-[#6eDD86]/20 bg-[#6eDD86]/10 text-[#6eDD86]' : 'border-gray-500/20 bg-gray-500/5 text-gray-500'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Live' ? 'bg-[#6eDD86] shadow-[0_0_6px_#6eDD86]' : 'bg-gray-600'}`}></div>
                        {p.status}
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-600">
                        <Link 
                          href={`/admin/inventory/edit/${p.id}`}
                          className="p-2 hover:bg-[#1a1a1a] hover:text-[#6eDD86] rounded-xl transition-all cursor-pointer border border-[#1f1f1f]"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 hover:bg-[#1a1a1a] hover:text-red-500 rounded-xl transition-all cursor-pointer border border-[#1f1f1f]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-8 flex items-center justify-between text-[#666] text-xs font-bold uppercase tracking-widest">
          <p>Showing 1 - {filteredProducts.length} of {products.length} products</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <span className="text-white">10</span>
              <ChevronRight size={14} className="rotate-90" />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-1 px-3 rounded-lg hover:bg-[#1a1a1a] transition-all"><ChevronLeft size={16} /></button>
              <button className="p-1 px-3 rounded-lg hover:bg-[#1a1a1a] transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* System Log Section */}
      <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10">
        <div className="flex items-center gap-3 mb-8">
          <Activity size={24} className="text-[#6eDD86]" />
          <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-gray-400">System Log</h2>
        </div>

        <div className="space-y-8 mb-10">
          {initialLogs.map((log) => (
            <div key={log.id} className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:w-2.5 before:h-2.5 before:rounded-full before:bg-[#6eDD86] before:shadow-[0_0_10px_rgba(110,221,134,0.3)]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white">{log.message}</p>
                <span className="text-[10px] font-bold text-gray-600 uppercase tabular-nums">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {initialLogs.length === 0 && (
            <p className="text-gray-500 text-sm italic">No recent logs</p>
          )}
        </div>

        <button className="w-full bg-[#6eDD86] text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#5dbb72] transition-colors cursor-pointer active:scale-[0.995]">
          View Full Log
        </button>
      </div>

    </div>
  );
}
