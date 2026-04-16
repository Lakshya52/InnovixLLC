"use client";

import React, { useState } from "react";
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
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { addStock } from "@/actions/inventory";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
}

export default function KeysClient({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setMessage({ type: "error", text: "Please select a product first." });
      return;
    }

    const keys = keyInput
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keys.length === 0) {
      setMessage({ type: "error", text: "Please enter at least one product key." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await addStock(selectedProductId, keys);
      setMessage({ type: "success", text: `Successfully uploaded ${keys.length} keys!` });
      setKeyInput("");
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to upload keys." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="p-8 mx-auto w-full max-w-[1200px] min-h-screen">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Link 
          href="/admin/inventory" 
          className="flex items-center gap-2 text-gray-500 hover:text-(--accent) transition-colors text-sm font-bold uppercase tracking-widest group"
        >
          <div className="p-2 bg-(--bg-dark) rounded-xl border border-(--bg-less-dark) group-hover:border-(--accent)/30 transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Inventory
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Manage <span className="text-(--accent) drop-shadow-[0_0_15px_rgba(110,221,134,0.3)]">Product Keys</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Bulk upload license keys for your digital software catalog. Each key will be securely stored and linked to the selected product for fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpload} className="bg-(--bg-dark) border border-(--bg-dark) rounded-[40px] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <UploadCloud size={200} />
            </div>

            <div className="relative z-10 space-y-10">
              {/* Product Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                  <Package size={16} className="text-(--accent)" />
                  Internal Product
                </label>
                <div className="relative group">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-(--bg-dark) border border-(--bg-less-dark) text-(--text-main) px-6 py-5 rounded-2xl font-bold text-lg appearance-none focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent)/30 transition-all cursor-pointer group-hover:border-[#333]"
                    required
                  >
                    <option value="" disabled>Select a product to stock...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <Layers size={20} />
                  </div>
                </div>
              </div>

              {/* Keys Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-end ml-1">
                  <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                    <Key size={16} className="text-(--accent)" />
                    License Keys (Bulk)
                  </label>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest bg-(--bg-dark) px-3 py-1 rounded-lg">
                    One key per line
                  </span>
                </div>
                <textarea
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY-YYYYY"
                  className="w-full bg-(--bg-dark) border border-(--bg-less-dark) text-(--text-main) px-8 py-6 rounded-3xl font-mono text-base h-[300px] focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent)/30 transition-all resize-none placeholder:text-gray-800"
                  required
                />
              </div>

              {/* Status Message */}
              {message && (
                <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.type === "success" ? "bg-(--accent)/10 border border-(--accent)/20 text-(--accent)" : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {message.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  <p className="font-bold text-sm tracking-wide">{message.text}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-(--accent) disabled:bg-gray-800 disabled:text-gray-500 text-(--bg-dark) py-6 rounded-[22px] font-(--bg-dark) text-sm uppercase tracking-[0.25em] hover:bg-(--accent) transition-all cursor-pointer shadow-[0_10px_30px_rgba(110,221,134,0.15)] hover:shadow-[0_15px_40px_rgba(110,221,134,0.25)] active:scale-[0.985] flex items-center justify-center gap-3 group"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-(--bg-dark)/30 border-t-(--bg-dark) rounded-full animate-spin" />
                ) : (
                  <>
                    Deploy Inventory <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Info & Summary */}
        <div className="space-y-8">
          <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[40px] p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-(--bg-dark) rounded-xl flex items-center justify-center border border-(--bg-less-dark)">
                <Plus size={20} className="text-(--accent)" />
              </div>
              Import Summary
            </h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-(--bg-dark) rounded-2xl border border-(--bg-less-dark) group hover:border-[#333] transition-all">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Target Product</p>
                <p className="text-lg font-bold text-(--text-main) leading-tight">
                  {selectedProduct?.name || "None Selected"}
                </p>
                <p className="text-xs text-(--accent) font-medium mt-1">
                  {selectedProduct?.category || "---"}
                </p>
              </div>

              <div className="p-6 bg-(--bg-dark) rounded-2xl border border-(--bg-less-dark) group hover:border-[#333] transition-all">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Batch Size</p>
                <p className="text-4xl font-(--bg-dark) text-(--text-main)">
                  {keyInput.split("\n").filter(k => k.trim()).length.toString().padStart(2, '0')}
                </p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Valid keys detected</p>
              </div>

              <div className="pt-4 px-2">
                <div className="flex items-start gap-4 text-gray-500">
                  <AlertCircle size={32} className="shrink-0 text-yellow-500/50" />
                  <p className="text-xs leading-relaxed italic">
                    Keys are validated server-side. Ensure each key is unique and formatted correctly for the target software.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-(--bg-dark) to-(--bg-dark) border border-(--bg-dark) rounded-[40px] p-8 border-l-4 border-l-(--accent)">
            <h4 className="text-sm font-bold text-(--accent) uppercase tracking-widest mb-4">Stock Management Tips</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                <CheckCircle2 size={14} className="shrink-0 text-(--accent)" />
                Paste raw lists from suppliers directly into the text area.
              </li>
              <li className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                <CheckCircle2 size={14} className="shrink-0 text-(--accent)" />
                Validation removes duplicates and empty lines automatically.
              </li>
              <li className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                <CheckCircle2 size={14} className="shrink-0 text-(--accent)" />
                Successful uploads are logged in the System Inventory Log.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
