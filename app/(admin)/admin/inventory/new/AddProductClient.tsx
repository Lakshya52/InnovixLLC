"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  MessageSquare, 
  Settings, 
  BookOpen, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight, 
  Info, 
  FileText, 
  Cpu, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Trash2,
  CheckCircle2,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/actions/inventory";
import { useRouter } from "next/navigation";

export default function AddProductClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Security & Privacy",
    shortDescription: "",
    description: "",
    longDescriptionTwo: "",
    featureHeading: "",
    price: 49.99,
    msrp: 89.99,
    status: "Live",
    minCPU: "", minRAM: "", minStorage: "", minGPU: "",
    recCPU: "", recRAM: "", recStorage: "", recGPU: "",
    features: ["Verified Licensing", "Instant Delivery"],
    coupons: ["INNOVIX_50"]
  });

  const [newFeature, setNewFeature] = useState("");
  const [newCoupon, setNewCoupon] = useState("");

  const handleSave = async (status: string) => {
    setLoading(true);
    try {
      await createProduct({ ...formData, status });
      router.push("/admin/inventory");
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      {/* Main Content */}
      <main className="flex-grow p-10 max-h-screen overflow-y-auto scrollbar-hide">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-10">
           <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                 Inventory <ChevronRight size={12} /> <span className="text-[#6eDD86]">New Product</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">Add New <span className="text-[#6eDD86]">Product</span></h1>
              <p className="text-[#a0a0a0] text-sm mt-3 max-w-xl">Configure your digital software listing with precision. High-performance data for the Digital Kinetic.</p>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => handleSave("Draft")}
                disabled={loading}
                className="px-8 py-4 rounded-full font-bold text-sm bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Save Draft
              </button>
              <button 
                onClick={() => handleSave("Live")}
                disabled={loading}
                className="px-10 py-4 rounded-full font-bold text-sm bg-[#6eDD86] text-black hover:bg-[#5dbb72] transition-all cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-95"
              >
                {loading ? "Publishing..." : "Publish Product"}
              </button>
           </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
           {/* Form - Left Column */}
           <div className="col-span-8 space-y-10">
              {/* Basic Info */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#6eDD86]/10 rounded-xl flex items-center justify-center text-[#6eDD86]">
                       <Info size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Basic Information</h2>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Product Title</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         placeholder="e.g. CyberLink VPN Pro Max" 
                         className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Category</label>
                       <select 
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all appearance-none cursor-pointer"
                       >
                         <option>OS</option>
                         <option>Security & Privacy</option>
                         <option>Enterprise</option>
                         <option>Productivity</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Internal SKU</label>
                       <input 
                         type="text" 
                         value={formData.sku}
                         onChange={(e) => setFormData({...formData, sku: e.target.value})}
                         placeholder="KIN-VPN-2024" 
                         className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Short Description</label>
                       <textarea 
                          rows={3}
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                          placeholder="A concise hook for the product list view..."
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all resize-none"
                       />
                    </div>
                 </div>
              </section>

              {/* Long Form Description */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#6eDD86]/10 rounded-xl flex items-center justify-center text-[#6eDD86]">
                       <FileText size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Long Form Description</h2>
                 </div>

                 <div className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Feature Heading</label>
                        <input 
                          type="text" 
                          value={formData.featureHeading}
                          onChange={(e) => setFormData({...formData, featureHeading: e.target.value})}
                          placeholder="Why choose this software?" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                        />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Paragraph One (The Value)</label>
                       <textarea 
                          rows={4}
                          value={formData.description || ""}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Detail the core benefits..."
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-[24px] p-6 text-sm outline-none focus:border-[#6eDD86]/30 transition-all resize-none"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Paragraph Two (The Technicals)</label>
                       <textarea 
                          rows={4}
                          value={formData.longDescriptionTwo || ""}
                          onChange={(e) => setFormData({...formData, longDescriptionTwo: e.target.value})}
                          placeholder="Detail the technical superiority..."
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-[24px] p-6 text-sm outline-none focus:border-[#6eDD86]/30 transition-all resize-none"
                       />
                    </div>
                 </div>
              </section>

              {/* System Requirements */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#6eDD86]/10 rounded-xl flex items-center justify-center text-[#6eDD86]">
                       <Cpu size={20} />
                    </div>
                    <div className="flex items-center gap-4">
                       <h2 className="text-xl font-bold">System Requirements</h2>
                       <button className="text-[10px] font-bold text-[#6eDD86] uppercase tracking-widest hover:underline">Auto-Fill</button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Minimum Requirements</h4>
                       <input 
                          type="text" value={formData.minCPU || ""} 
                          onChange={(e) => setFormData({...formData, minCPU: e.target.value})}
                          placeholder="Processor (e.g. Intel Core i3)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                       <input 
                          type="text" value={formData.minRAM || ""} 
                          onChange={(e) => setFormData({...formData, minRAM: e.target.value})}
                          placeholder="Memory (e.g. 8GB RAM)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                       <input 
                          type="text" value={formData.minStorage || ""} 
                          onChange={(e) => setFormData({...formData, minStorage: e.target.value})}
                          placeholder="Storage (e.g. 50GB available)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                       <input 
                          type="text" value={formData.minGPU || ""} 
                          onChange={(e) => setFormData({...formData, minGPU: e.target.value})}
                          placeholder="Graphics (e.g. DirectX 11)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Recommended Requirements</h4>
                       <input 
                          type="text" value={formData.recCPU || ""} 
                          onChange={(e) => setFormData({...formData, recCPU: e.target.value})}
                          placeholder="Processor (e.g. Ryzen 7 5800X)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                       <input 
                          type="text" value={formData.recRAM || ""} 
                          onChange={(e) => setFormData({...formData, recRAM: e.target.value})}
                          placeholder="Memory (e.g. 16GB RAM)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                       <input 
                          type="text" value={formData.recStorage || ""} 
                          onChange={(e) => setFormData({...formData, recStorage: e.target.value})}
                          placeholder="Storage (e.g. SSD 100GB)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                       <input 
                          type="text" value={formData.recGPU || ""} 
                          onChange={(e) => setFormData({...formData, recGPU: e.target.value})}
                          placeholder="Graphics (e.g. RTX 3060)" 
                          className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-[#6eDD86]/30 transition-all" 
                       />
                    </div>
                 </div>
              </section>
           </div>

           {/* Stats - Right Column */}
           <div className="col-span-4 space-y-10">
              {/* Pricing */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-8">Pricing Structure</h3>
                 <div className="space-y-6">
                    <div>
                       <label className="block text-[9px] font-bold text-gray-500 uppercase mb-3">Selling Price (USD)</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-2xl font-bold font-mono outline-none focus:border-[#6eDD86]/30" 
                          />
                       </div>
                    </div>
                    <div>
                       <label className="block text-[9px] font-bold text-gray-500 uppercase mb-3">MSRP (Strike-through)</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                          <input 
                            type="number" 
                            value={formData.msrp || 0}
                            onChange={(e) => setFormData({...formData, msrp: parseFloat(e.target.value)})}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-xl font-bold text-gray-500 font-mono outline-none focus:border-[#6eDD86]/30" 
                          />
                       </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center p-1 group-hover:border-[#6eDD86]">
                          <div className="w-full h-full bg-[#6eDD86] rounded-full scale-100 transition-transform"></div>
                       </div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-gray-300">Price includes all digital taxes</span>
                    </label>
                 </div>
              </section>

              {/* Trust Architecture */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-4">Trust Architecture</h3>
                 <p className="text-[10px] text-gray-500 mb-8">Add the "signals" that drive conversion. These appear prominently on the product page.</p>
                 
                 <div className="space-y-3">
                    {formData.features.map((feature, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-xl group hover:border-white/10">
                          <div className="flex items-center gap-3">
                             <CheckCircle2 size={14} className="text-[#6eDD86]" />
                             <span className="text-xs font-bold text-gray-300">{feature}</span>
                          </div>
                          <button 
                            onClick={() => setFormData({...formData, features: formData.features.filter((_, idx) => idx !== i)})}
                            className="p-1.5 bg-[#0d0d0d] text-gray-600 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={12} />
                          </button>
                       </div>
                    ))}
                    <div className="flex bg-[#1a1a1a] border border-dashed border-white/10 rounded-xl p-3 mt-4 group focus-within:border-[#6eDD86]/30 transition-all">
                       <input 
                         type="text" 
                         value={newFeature}
                         onChange={(e) => setNewFeature(e.target.value)}
                         placeholder="Add new feature..." 
                         className="flex-grow bg-transparent text-xs font-medium outline-none px-2 text-gray-400 placeholder:text-gray-700" 
                       />
                       <button 
                         onClick={() => {
                           if (newFeature.trim()) {
                             setFormData({...formData, features: [...formData.features, newFeature.trim()]});
                             setNewFeature("");
                           }
                         }}
                         className="p-1 px-2.5 bg-[#6eDD86] text-black rounded-lg hover:bg-[#5dbb72] transition-all cursor-pointer"
                       >
                          <Plus size={14} />
                       </button>
                    </div>
                 </div>
              </section>

              {/* Image Upload */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-8">Image</h3>
                 <div className="aspect-square bg-[#1a1a1a] border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-[#1f1f1f] hover:border-[#6eDD86]/30 transition-all">
                    <div className="p-5 bg-[#0d0d0d] rounded-2xl border border-white/5 text-gray-600 group-hover:scale-110 transition-transform">
                       <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload 1920x1080</p>
                       <p className="text-[10px] font-medium text-gray-700 mt-1 italic">Maximum file size: 5MB</p>
                    </div>
                 </div>
              </section>

              {/* Coupons */}
              <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-8">Coupons Codes</h3>
                 <div className="space-y-3">
                    {formData.coupons.map((coupon, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-xl group transition-all">
                          <span className="text-xs font-bold text-gray-300 font-mono tracking-wider">{coupon}</span>
                          <button 
                            onClick={() => setFormData({...formData, coupons: formData.coupons.filter((_, idx) => idx !== i)})}
                            className="p-1.5 bg-[#0d0d0d] text-gray-600 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={12} />
                          </button>
                       </div>
                    ))}
                    <div className="flex bg-[#1a1a1a] border border-dashed border-white/10 rounded-xl p-3 mt-4 group focus-within:border-[#6eDD86]/30">
                       <input 
                         type="text" 
                         value={newCoupon}
                         onChange={(e) => setNewCoupon(e.target.value)}
                         placeholder="Enter Coupon Codes" 
                         className="flex-grow bg-transparent text-xs font-medium outline-none px-2 text-gray-400 font-mono" 
                       />
                       <button 
                        onClick={() => {
                           if (newCoupon.trim()) {
                             setFormData({...formData, coupons: [...formData.coupons, newCoupon.trim()]});
                             setNewCoupon("");
                           }
                        }}
                        className="p-1 bg-[#6eDD86] text-black rounded-lg hover:bg-[#5dbb72] transition-colors cursor-pointer"
                       >
                          <Plus size={14} />
                       </button>
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </main>
    </div>
  );
}
