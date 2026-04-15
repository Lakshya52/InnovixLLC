"use client";

import React, { useState, useRef, useEffect } from "react";
import {
   ChevronRight,
   Info,
   FileText,
   Cpu,
   Plus,
   X,
   Trash2,
   CheckCircle2,
   Upload,
   Key
} from "lucide-react";
import { updateProduct } from "@/actions/inventory";
import { useRouter } from "next/navigation";

export default function EditProductClient({ product }: { product: any }) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "Security & Privacy",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      longDescriptionTwo: product.longDescriptionTwo || "",
      featureHeading: product.featureHeading || "",
      price: product.price || 49.99,
      msrp: product.msrp || 89.99,
      status: product.status || "Live",
      image: product.image || "",
      systemRequirements: (product.systemRequirements as any) || [
         { title: "Processor", minimum: product.minCPU || "", recommended: product.recCPU || "" },
         { title: "Memory", minimum: product.minRAM || "", recommended: product.recRAM || "" },
         { title: "Storage", minimum: product.minStorage || "", recommended: product.recStorage || "" },
         { title: "Graphics", minimum: product.minGPU || "", recommended: product.recGPU || "" },
      ],
      features: product.features || ["Verified Licensing", "Instant Delivery"],
      coupons: ["INNOVIX_50"],
      newKeys: ""
   });

   const [imagePreview, setImagePreview] = useState<string | null>(product.image || null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
         alert("File size must be less than 5MB");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
         const base64 = reader.result as string;
         setImagePreview(base64);
         setFormData((prev) => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
   };

   const removeImage = () => {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, image: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   const [newFeature, setNewFeature] = useState("");

   const handleSave = async (status: string) => {
      setLoading(true);
      try {
         await updateProduct(product.id, { ...formData, status });
         router.push("/admin/inventory");
      } catch (err) {
         console.error(err);
         alert("Failed to update product");
      } finally {
         setLoading(false);
      }
   };

   const addRequirementRow = () => {
      setFormData((prev) => ({
         ...prev,
         systemRequirements: [
            ...prev.systemRequirements,
            { title: "", minimum: "", recommended: "" }
         ]
      }));
   };

   const removeRequirementRow = (index: number) => {
      setFormData((prev) => ({
         ...prev,
         systemRequirements: prev.systemRequirements.filter((_, i) => i !== index)
      }));
   };

   const updateRequirement = (index: number, field: "title" | "minimum" | "recommended", value: string) => {
      setFormData((prev) => {
         const updated = [...prev.systemRequirements];
         updated[index] = { ...updated[index], [field]: value };
         return { ...prev, systemRequirements: updated };
      });
   };


   return (
      <div className="flex min-h-screen bg-[#0d0d0d] text-white p-10">
         <main className="flex-grow max-w-[1400px] mx-auto w-full">
            {/* Title Section */}
            <div className="flex items-center justify-between mb-10">
               <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                     Inventory <ChevronRight size={12} /> <span className="text-[#6eDD86]">Edit Product</span>
                  </div>
                  <h1 className="text-5xl font-bold tracking-tight">Modify <span className="text-[#6eDD86]">Product</span></h1>
                  <p className="text-[#a0a0a0] text-sm mt-3 max-w-xl">Editing: {product.name}. ID: {product.id}</p>
               </div>
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => handleSave("Draft")}
                     disabled={loading}
                     className="px-8 py-4 rounded-full font-bold text-sm bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                     Move to Draft
                  </button>
                  <button
                     onClick={() => handleSave("Live")}
                     disabled={loading}
                     className="px-10 py-4 rounded-full font-bold text-sm bg-[#6eDD86] text-black hover:bg-[#5dbb72] transition-all cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-95"
                  >
                     {loading ? "Updating..." : "Update Product"}
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
               {/* Form - Left Column */}
               <div className="col-span-8 space-y-10">
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
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Category</label>
                           <select
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                           />
                        </div>
                        <div className="col-span-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Short Description</label>
                           <textarea
                              rows={3}
                              value={formData.shortDescription}
                              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all resize-none"
                           />
                        </div>
                     </div>
                  </section>

                  <section className="bg-[#121212] border border-white/5 rounded-[40px] p-10">
                     <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#6eDD86]/10 rounded-xl flex items-center justify-center text-[#6eDD86]">
                           <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Product Descriptions</h2>
                     </div>
                     <div className="space-y-8">
                        <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Feature Heading</label>
                           <input
                              type="text"
                              value={formData.featureHeading}
                              onChange={(e) => setFormData({ ...formData, featureHeading: e.target.value })}
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Value Proposition Paragraph</label>
                           <textarea
                              rows={4}
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-[24px] p-6 text-sm outline-none focus:border-[#6eDD86]/30 transition-all resize-none"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Technical Details Paragraph</label>
                           <textarea
                              rows={4}
                              value={formData.longDescriptionTwo}
                              onChange={(e) => setFormData({ ...formData, longDescriptionTwo: e.target.value })}
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-[24px] p-6 text-sm outline-none focus:border-[#6eDD86]/30 transition-all resize-none"
                           />
                        </div>
                     </div>
                  </section>

                  <section className="bg-[#121212] border border-white/5 rounded-[40px] p-10">
                     <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#6eDD86]/10 rounded-xl flex items-center justify-center text-[#6eDD86]">
                           <Cpu size={20} />
                        </div>
                        <h2 className="text-xl font-bold">System Requirements</h2>
                     </div>
                     <div className="space-y-6">
                        <div className="grid grid-cols-12 gap-4 pb-2 border-b border-white/5">
                           <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Requirement</div>
                           <div className="col-span-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Minimum</div>
                           <div className="col-span-4 text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest">Recommended</div>
                           <div className="col-span-1"></div>
                        </div>

                        {formData.systemRequirements.map((req: any, idx: number) => (
                           <div key={idx} className="grid grid-cols-12 gap-4 items-center group">
                              <div className="col-span-3">
                                 <input
                                    type="text"
                                    value={req.title}
                                    onChange={(e) => updateRequirement(idx, "title", e.target.value)}
                                    placeholder="e.g. CPU"
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none focus:border-[#6eDD86]/30 transition-all font-bold"
                                 />
                              </div>
                              <div className="col-span-4">
                                 <input
                                    type="text"
                                    value={req.minimum}
                                    onChange={(e) => updateRequirement(idx, "minimum", e.target.value)}
                                    placeholder="Minimum..."
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none focus:border-[#6eDD86]/30 transition-all text-gray-400"
                                 />
                              </div>
                              <div className="col-span-4">
                                 <input
                                    type="text"
                                    value={req.recommended}
                                    onChange={(e) => updateRequirement(idx, "recommended", e.target.value)}
                                    placeholder="Recommended..."
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none focus:border-[#6eDD86]/30 transition-all text-yellow-500/70"
                                 />
                              </div>
                              <div className="col-span-1 flex justify-end">
                                 <button
                                    onClick={() => removeRequirementRow(idx)}
                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </div>
                        ))}

                        <button
                           onClick={addRequirementRow}
                           className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:border-[#6eDD86]/30 hover:text-[#6eDD86] transition-all flex items-center justify-center gap-2"
                        >
                           <Plus size={14} /> Add Requirement Row
                        </button>
                     </div>
                  </section>
               </div>

               <div className="col-span-4 space-y-10">
                  <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                     <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-8">Pricing Struct</h3>
                     <div className="space-y-6">
                        <div>
                           <label className="block text-[9px] font-bold text-gray-500 uppercase mb-3">Price (USD)</label>
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                              <input
                                 type="number"
                                 step="0.01"
                                 value={formData.price}
                                 onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                 className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-2xl font-bold font-mono outline-none focus:border-[#6eDD86]/30"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-gray-500 uppercase mb-3">MSRP</label>
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                              <input
                                 type="number"
                                 value={formData.msrp}
                                 onChange={(e) => setFormData({ ...formData, msrp: parseFloat(e.target.value) })}
                                 className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-xl font-bold text-gray-500 font-mono outline-none focus:border-[#6eDD86]/30"
                              />
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Image Upload */}
                  <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                     <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-8">Product Media</h3>
                     {imagePreview ? (
                        <div className="relative rounded-[24px] overflow-hidden mb-4">
                           <img src={imagePreview} alt="Preview" className="w-full h-[240px] object-cover" />
                           <button onClick={removeImage} className="absolute top-3 right-3 w-9 h-9 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-red-400 transition-all">
                              <X size={16} />
                           </button>
                        </div>
                     ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="aspect-[16/10] bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#1f1f1f] transition-all">
                           <Upload size={32} className="text-gray-600" />
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upload New Image</p>
                        </div>
                     )}
                     <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                     <input type="text" value={formData.image && !formData.image.startsWith("data:") ? formData.image : ""} onChange={(e) => { setFormData((prev) => ({ ...prev, image: e.target.value })); setImagePreview(e.target.value || null); }} placeholder="Or paste image URL..." className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none mt-4" />
                  </section>

                  {/* Trust Signals */}
                  <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                     <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase mb-4">Trust Features</h3>
                     <div className="space-y-3">
                        {formData.features.map((feature, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-xl group">
                              <div className="flex items-center gap-3">
                                 <CheckCircle2 size={14} className="text-[#6eDD86]" />
                                 <span className="text-xs font-bold text-gray-300">{feature}</span>
                              </div>
                              <button onClick={() => setFormData({ ...formData, features: formData.features.filter((_, idx) => idx !== i) })} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                                 <Trash2 size={12} />
                              </button>
                           </div>
                        ))}
                        <div className="flex mt-4 gap-2">
                           <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="New signal..." className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none" />
                           <button onClick={() => { if(newFeature) { setFormData({...formData, features: [...formData.features, newFeature]}); setNewFeature(""); } }} className="p-3 bg-[#6eDD86] text-black rounded-xl hover:bg-[#5dbb72] transition-all">
                              <Plus size={16} />
                           </button>
                        </div>
                     </div>
                  </section>

                  {/* Product Keys */}
                  <section className="bg-[#121212] border border-white/5 rounded-[40px] p-8">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-bold text-[#6eDD86] tracking-[0.2em] uppercase">Inventory Keys</h3>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">Stock Control</span>
                     </div>
                     <p className="text-[10px] text-gray-500 mb-6 italic">Assign additional license keys to this product. Enter one key per line.</p>
                     <div className="space-y-4">
                        <div className="relative group">
                           <div className="absolute left-5 top-5 text-gray-700 group-focus-within:text-[#6eDD86] transition-colors">
                              <Key size={18} />
                           </div>
                           <textarea
                              rows={8}
                              value={formData.newKeys}
                              onChange={(e) => setFormData({ ...formData, newKeys: e.target.value })}
                              placeholder="XXXXX-XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY-YYYYY"
                              className="w-full bg-[#1a1a1a] border border-white/5 rounded-[24px] pt-14 pb-6 px-6 text-xs font-mono outline-none focus:border-[#6eDD86]/30 transition-all resize-none placeholder:text-gray-800"
                           />
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <p className="text-[9px] font-bold text-gray-600 uppercase">
                              Detected: <span className="text-[#6eDD86]">{formData.newKeys.split('\n').filter(k => k.trim()).length} new keys</span>
                           </p>
                           <p className="text-[9px] font-bold text-gray-600 uppercase">One per line</p>
                        </div>
                     </div>
                  </section>
               </div>
            </div>
         </main>
      </div>
   );
}
