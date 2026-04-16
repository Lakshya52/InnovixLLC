"use client";

import React, { useState, useRef, useEffect } from "react";
import {
   ChevronRight,
   Bold,
   Italic,
   List,
   Link2,
   Image as ImageIcon,
   Code,
   Upload,
   X,
   Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateBlogPost } from "@/actions/blog";

export default function EditBlogPostClient({ post }: { post: any }) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [autosaved, setAutosaved] = useState<string | null>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const [formData, setFormData] = useState({
      title: post.title,
      slug: post.slug,
      content: post.content,
      summary: post.excerpt || "",
      category: post.category,
      tags: post.keyTakeaways || [],
      seoDescription: post.seoDescription || "",
      featuredImage: post.image || "",
      status: post.status || "PUBLISHED",
      visibility: post.visibility || "Public",
      promoted: post.promoted || false,
      publishDate: post.publishDate || null,
   });

   const [newTag, setNewTag] = useState("");
   const [manualSlug, setManualSlug] = useState(true); // Default to true for existing posts

   // Auto-generate slug from title ONLY if not manually modified or requested
   useEffect(() => {
      if (formData.title && !manualSlug) {
         const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "")
            .trim();
         setFormData((prev) => ({ ...prev, slug: slug }));
      }
   }, [formData.title, manualSlug]);

   // Word count
   const wordCount = formData.content
      .trim()
      .split(/\s+/)
      .filter((w: string) => w.length > 0).length;

   const insertMarkdown = (prefix: string, suffix = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = formData.content.substring(start, end);
      const newContent =
         formData.content.substring(0, start) +
         prefix +
         (selectedText || "text") +
         suffix +
         formData.content.substring(end);
      setFormData((prev) => ({ ...prev, content: newContent }));
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
      }, 0);
   };

   const handleSave = async () => {
      if (!formData.title.trim()) {
         alert("Please enter a post title");
         return;
      }
      setLoading(true);
      try {
         await updateBlogPost(post.id, {
            ...formData,
         });
         router.push("/admin/blogs");
         router.refresh();
      } catch (err) {
         console.error(err);
         alert("Failed to update post");
      } finally {
         setLoading(false);
      }
   };

   const addTag = () => {
      const tag = newTag.trim();
      if (tag && !formData.tags.includes(tag)) {
         setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
         setNewTag("");
      }
   };

   const removeTag = (tag: string) => {
      setFormData((prev) => ({
         ...prev,
         tags: prev.tags.filter((t:any) => t !== tag),
      }));
   };

   return (
      <div className="p-8 mx-auto w-full max-h-screen overflow-y-auto scrollbar-hide">
         {/* Breadcrumb & Title */}
         <div className="flex items-center justify-between mb-10">
            <div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  <Link href="/admin/dashboard" className="hover:text-gray-300 transition-colors">
                     Admin
                  </Link>
                  <ChevronRight size={12} />
                  <Link href="/admin/blogs" className="hover:text-gray-300 transition-colors">
                     Blogs
                  </Link>
                  <ChevronRight size={12} />
                  <span className="text-[#6eDD86]">Edit Post</span>
               </div>
               <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Edit <span className="text-[#6eDD86]">Blog Post</span>
               </h1>
            </div>
            <div className="flex items-center gap-4">
               <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-10 py-4 rounded-full font-bold text-sm bg-[#6eDD86] text-black hover:bg-[#5dbb72] transition-all cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-95 disabled:opacity-50"
               >
                  {loading ? "Saving..." : "Save Changes"}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-8">
               <section className="bg-[#121212] border border-white/5 rounded-[32px] p-8">
                  <div className="mb-6">
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Post Title
                     </label>
                     <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                           setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all text-white"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                           Category
                        </label>
                        <select
                           value={formData.category}
                           onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                           className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all appearance-none cursor-pointer"
                        >
                           <option>Engineering</option>
                           <option>Infrastructure</option>
                           <option>Security</option>
                           <option>Licensing</option>
                           <option>Product</option>
                           <option>General</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                           Short Summary
                        </label>
                        <input
                           type="text"
                           value={formData.summary}
                           onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                           className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-[#6eDD86]/30 transition-all"
                        />
                     </div>
                  </div>
               </section>

               <section className="bg-[#121212] border border-white/5 rounded-[32px] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                     <div className="flex items-center gap-1">
                        <button onClick={() => insertMarkdown("**", "**")} className="toolbar-btn"><Bold size={16} /></button>
                        <button onClick={() => insertMarkdown("*", "*")} className="toolbar-btn"><Italic size={16} /></button>
                        <button onClick={() => insertMarkdown("\n- ")} className="toolbar-btn"><List size={16} /></button>
                        <div className="w-px h-5 bg-white/10 mx-2"></div>
                        <button onClick={() => insertMarkdown("[", "](url)")} className="toolbar-btn"><Link2 size={16} /></button>
                        <button onClick={() => insertMarkdown("![alt](", ")")} className="toolbar-btn"><ImageIcon size={16} /></button>
                        <button onClick={() => insertMarkdown("`", "`")} className="toolbar-btn"><Code size={16} /></button>
                     </div>
                  </div>

                  <textarea
                     ref={textareaRef}
                     value={formData.content}
                     onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                     className="w-full bg-transparent p-8 text-sm text-[#e2e2e2] outline-none resize-none min-h-[400px] leading-relaxed"
                  />
                  <div className="flex items-center justify-between px-8 py-4 border-t border-white/5">
                     <span className="text-[10px] font-bold text-gray-600">Word Count: {wordCount}</span>
                  </div>
               </section>
            </div>

            <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-8">
               <section className="bg-[#121212] border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Featured Image</h3>
                  {formData.featuredImage && (
                     <div className="relative rounded-2xl overflow-hidden mb-4">
                        <img src={formData.featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                        <button onClick={() => setFormData(prev => ({ ...prev, featuredImage: "" }))} className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white"><X size={14} /></button>
                     </div>
                  )}
                  <input
                     type="text"
                     value={formData.featuredImage}
                     onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                     placeholder="Image URL..."
                     className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none"
                  />
               </section>

               <section className="bg-[#121212] border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-[#6eDD86] uppercase tracking-[0.2em] mb-6">Metadata</h3>
                  <div className="mb-6">
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Tags</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag: any) => (
                           <span key={tag} className="px-3 py-1.5 rounded-full bg-[#6eDD86]/10 text-[#6eDD86] text-[10px] font-bold flex items-center gap-1">
                              #{tag} <button onClick={() => removeTag(tag)}><X size={10} /></button>
                           </span>
                        ))}
                     </div>
                     <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-xs outline-none"
                     />
                  </div>
               </section>

               <section className="bg-[#121212] border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-[#6eDD86] uppercase tracking-[0.2em] mb-6">Slug & Status</h3>
                  <div className="space-y-4">
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">URL Slug</span>
                            <button 
                                onClick={() => setManualSlug(false)}
                                className="text-[#6eDD86] text-[9px] font-bold uppercase"
                            >
                                Reset to Title
                            </button>
                        </div>
                        <input 
                            type="text"
                            value={formData.slug}
                            onChange={(e) => {
                                setManualSlug(true);
                                setFormData(prev => ({ ...prev, slug: e.target.value }));
                            }}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 text-[#6eDD86] font-mono text-xs outline-none focus:border-[#6eDD86]/30 transition-all"
                        />
                     </div>
                     
                     <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-white/5">
                        <span className="text-gray-500">Status</span>
                        <select
                           value={formData.status}
                           onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                           className="bg-transparent text-[#6eDD86] outline-none cursor-pointer font-bold"
                        >
                           <option value="PUBLISHED">Published</option>
                           <option value="DRAFT">Draft</option>
                           <option value="ARCHIVED">Archived</option>
                        </select>
                     </div>
                  </div>
               </section>
            </div>
         </div>
         <style jsx>{`
            .toolbar-btn {
               width: 2.25rem;
               height: 2.25rem;
               display: flex;
               align-items: center;
               justify-content: center;
               border-radius: 0.5rem;
               color: #9ca3af;
               transition: all 0.2s;
               cursor: pointer;
            }
            .toolbar-btn:hover {
               color: white;
               background-color: rgba(255, 255, 255, 0.05);
            }
         `}</style>
      </div>
   );
}
