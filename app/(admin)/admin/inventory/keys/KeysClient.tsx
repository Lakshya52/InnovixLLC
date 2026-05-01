"use client";

import React, { useState, useMemo } from "react";
import { 
  Key, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Layers,
  UploadCloud,
  ArrowRight,
  Search,
  Filter,
  Activity,
  X,
  Loader2,
  Calendar,
  Tag,
  Eye,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import { addStock, deleteStockKey } from "@/actions/inventory";
import { useRouter } from "next/navigation";

interface InventoryKey {
  id: string;
  productId: string;
  keyValue: string;
  isSold: boolean;
  createdAt: string;
  product: {
    name: string;
    category: string;
  };
}

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
}

export default function KeysClient({ 
  initialKeys, 
  products 
}: { 
  initialKeys: InventoryKey[];
  products: Product[];
}) {
  const [keys, setKeys] = useState<InventoryKey[]>(initialKeys);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All Products");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Upload state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const router = useRouter();

  // Filtering Logic
  const filteredKeys = useMemo(() => {
    return keys.filter(k => {
      const matchesSearch = k.keyValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          k.product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || 
                           (statusFilter === "Sold" ? k.isSold : !k.isSold);
      const matchesProduct = productFilter === "All Products" || k.productId === productFilter;
      
      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [keys, searchTerm, statusFilter, productFilter]);

  // Stats
  const stats = {
    total: keys.length,
    available: keys.filter(k => !k.isSold).length,
    sold: keys.filter(k => k.isSold).length
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setUploadMessage({ type: "error", text: "Please select a product." });
      return;
    }

    const newKeys = keyInput
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (newKeys.length === 0) {
      setUploadMessage({ type: "error", text: "Please enter keys." });
      return;
    }

    setIsSubmitting(true);
    setUploadMessage(null);

    try {
      await addStock(selectedProductId, newKeys);
      setUploadMessage({ type: "success", text: `Uploaded ${newKeys.length} keys!` });
      setKeyInput("");
      
      // Refresh keys list (simple way)
      router.refresh();
      // In a real app we might fetch the updated list or the server would revalidate
      // For now we'll close the modal after a delay
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadMessage(null);
      }, 1500);
    } catch (err: any) {
      setUploadMessage({ type: "error", text: err.message || "Failed to upload." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this key? This will remove it from inventory.")) return;
    try {
      await deleteStockKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      alert("Failed to delete key");
    }
  };

  return (
    <div className="p-8 mx-auto w-full max-w-[1400px]">
      {/* Breadcrumbs & Header */}
      <div className="mb-10">
        <Link 
          href="/admin/inventory" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-(--accent) transition-colors text-[10px] font-bold uppercase tracking-widest mb-6"
        >
          <ChevronLeft size={14} /> Back to Catalog
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Vault <span className="text-(--accent)">Management</span></h1>
            <p className="text-(--text-main) text-sm max-w-2xl">Securely manage, monitor, and deploy license keys across your entire digital software ecosystem.</p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-(--accent) text-(--bg-dark) px-8 py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-[0_10px_30px_rgba(110,221,134,0.15)]"
          >
            <Plus size={18} />
            Bulk Upload Keys
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Keys Stored</p>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl"><Layers size={20} /></div>
          </div>
          <h3 className="text-4xl font-bold">{stats.total.toLocaleString()}</h3>
          <p className="text-xs text-gray-600 mt-2 font-medium italic">Across all product categories</p>
        </div>

        <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8 border-l-4 border-l-(--accent)">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available Stock</p>
            <div className="p-2 bg-(--accent)/10 text-(--accent) rounded-xl"><CheckCircle2 size={20} /></div>
          </div>
          <h3 className="text-4xl font-bold">{stats.available.toLocaleString()}</h3>
          <p className="text-xs text-(--accent) mt-2 font-bold">{( (stats.available / (stats.total || 1)) * 100 ).toFixed(1)}% Fill Rate</p>
        </div>

        <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8 border-l-4 border-l-red-500/50">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Distributed Keys</p>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl"><Tag size={20} /></div>
          </div>
          <h3 className="text-4xl font-bold">{stats.sold.toLocaleString()}</h3>
          <p className="text-xs text-gray-600 mt-2 font-medium italic">Successfully assigned to orders</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-6 mb-8 flex flex-col xl:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-(--accent) transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search key values or products..."
            className="w-full bg-(--bg-less-dark)/20 border border-(--bg-less-dark) text-(--text-main) pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-(--accent)/40 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:flex-none">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-(--bg-less-dark)/20 border border-(--bg-less-dark) text-(--text-main) px-6 py-4 rounded-2xl focus:outline-none focus:border-(--accent)/40 transition-all text-sm font-bold cursor-pointer pr-12"
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
          </div>

          <div className="relative flex-1 xl:flex-none">
            <select 
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full appearance-none bg-(--bg-less-dark)/20 border border-(--bg-less-dark) text-(--text-main) px-6 py-4 rounded-2xl focus:outline-none focus:border-(--accent)/40 transition-all text-sm font-bold cursor-pointer pr-12"
            >
              <option value="All Products">All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[40px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-less-dark)/5 border-b border-(--bg-less-dark)/50">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Key Information</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Target Product</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Added Date</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--bg-less-dark)/30">
              {filteredKeys.length > 0 ? filteredKeys.map((k) => (
                <tr key={k.id} className="group hover:bg-(--bg-less-dark)/20 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-(--bg-less-dark)/30 flex items-center justify-center border border-(--bg-less-dark) group-hover:border-(--accent)/30 transition-all">
                        <Key size={18} className="text-(--accent)/60 group-hover:text-(--accent) transition-colors" />
                      </div>
                      <code className="text-sm font-bold text-(--text-main) tracking-wider font-mono">{k.keyValue}</code>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-(--text-main) text-sm">{k.product.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">{k.product.category}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      k.isSold 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-(--accent)/10 border-(--accent)/20 text-(--accent)'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${k.isSold ? 'bg-red-400' : 'bg-(--accent) shadow-[0_0_6px] shadow-(--accent)'}`}></div>
                      {k.isSold ? 'Sold' : 'Available'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                      <Calendar size={14} className="opacity-50" />
                      {new Date(k.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {!k.isSold && (
                      <button 
                        onClick={() => handleDelete(k.id)}
                        className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-500/20"
                        title="Delete Key"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-(--bg-less-dark)/30 rounded-full flex items-center justify-center border border-(--bg-less-dark)">
                        <AlertCircle className="text-gray-600" size={32} />
                      </div>
                      <p className="text-gray-500 font-bold tracking-wide">No keys found matching your criteria.</p>
                      <button 
                        onClick={() => { setSearchTerm(""); setStatusFilter("All"); setProductFilter("All Products"); }}
                        className="text-(--accent) text-xs font-bold uppercase tracking-widest hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-(--bg-dark)/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-(--bg-dark) border border-(--bg-less-dark) rounded-[40px] w-full max-w-3xl overflow-hidden shadow-2xl scale-in-center">
            <div className="p-8 border-b border-(--bg-less-dark)/50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-(--text-main)">Bulk <span className="text-(--accent)">Deployment</span></h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Import new license keys into the secure vault.</p>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-3 text-gray-500 hover:text-(--text-main) rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Target Product</label>
                <div className="relative">
                  <select 
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full appearance-none bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) px-6 py-5 rounded-2xl focus:outline-none focus:border-(--accent) transition-all text-lg font-bold cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <Package className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Keys (One per line)</label>
                  <span className="text-[10px] text-gray-600 font-bold uppercase bg-(--bg-less-dark)/50 px-3 py-1 rounded-lg">Batch Import</span>
                </div>
                <textarea 
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY-YYYYY"
                  className="w-full h-64 bg-(--bg-less-dark)/30 border border-(--bg-less-dark) rounded-3xl p-8 text-sm font-mono text-(--text-main) focus:outline-none focus:border-(--accent) transition-all resize-none shadow-inner"
                  required
                />
              </div>

              {uploadMessage && (
                <div className={`p-6 rounded-2xl flex items-center gap-4 ${
                  uploadMessage.type === "success" ? "bg-(--accent)/10 border border-(--accent)/20 text-(--accent)" : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {uploadMessage.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  <p className="font-bold text-sm">{uploadMessage.text}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-(--accent) text-(--bg-dark) py-6 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-(--accent) transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Deploy to Vault <ArrowRight size={20} /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
