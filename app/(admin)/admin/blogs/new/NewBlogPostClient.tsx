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
   Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/actions/blog";

export default function NewBlogPostClient() {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [autosaved, setAutosaved] = useState<string | null>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const [formData, setFormData] = useState({
      title: "",
      slug: "",
      content: "",
      summary: "",
      category: "Engineering",
      tags: ["Admin", "Product"] as string[],
      seoDescription: "",
      featuredImage: "",
      status: "PUBLISHED",
      visibility: "Public",
      promoted: false,
      publishDate: null as string | null,
   });

   const [newTag, setNewTag] = useState("");

   // Auto-generate slug from title
   useEffect(() => {
      if (formData.title && !formData.slug) { // Only auto-generate if slug is empty
         const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // remove special chars
            .replace(/\s+/g, "-")          // spaces to dashes
            .replace(/-+/g, "-")          // collapse dashes
            .replace(/^-+|-+$/g, "")      // trim dashes from ends
            .trim();
         setFormData((prev) => ({ ...prev, slug: slug }));
      }
   }, [formData.title]);

   // Word count
   const wordCount = formData.content
      .trim()
      .split(/\s+/)
      .filter((w: string) => w.length > 0).length;

   // Auto-save simulation
   useEffect(() => {
      const timer = setInterval(() => {
         if (formData.title || formData.content) {
            setAutosaved("Autosaved just now");
            setTimeout(() => setAutosaved("Autosaved 2 minutes ago"), 120000);
         }
      }, 60000);
      return () => clearInterval(timer);
   }, [formData.title, formData.content]);

   // Markdown toolbar helper
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

   const handlePublish = async () => {
      if (!formData.title.trim()) {
         alert("Please enter a post title");
         return;
      }
      setLoading(true);
      try {
         await createBlogPost({
            ...formData,
            status: "PUBLISHED",
         });
         router.push("/admin/blogs");
      } catch (err) {
         console.error(err);
         alert("Failed to publish post");
      } finally {
         setLoading(false);
      }
   };

   const handlePreview = () => {
      // Could open a preview modal – for now, just alert
      alert("Preview coming soon – publish to see your post live.");
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
         tags: prev.tags.filter((t) => t !== tag),
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
                  <span className="text-(--accent)">New Post</span>
               </div>
               <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Create New <span className="text-(--accent)">Blog Post</span>
               </h1>
            </div>
            <div className="flex items-center gap-4">
               <button
                  onClick={handlePreview}
                  className="px-8 py-4 rounded-full font-bold text-sm bg-(--text-main)/5 border border-(--text-main)/10 text-gray-300 hover:text-(--text-main) hover:bg-(--text-main)/10 transition-all cursor-pointer"
               >
                  Preview
               </button>
               <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-10 py-4 rounded-full font-bold text-sm bg-(--accent) text-(--bg-dark) hover:bg-(--accent) transition-all cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-95 disabled:opacity-50"
               >
                  {loading ? "Publishing..." : "Publish Post"}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-12 gap-10">
            {/* Left Column – Editor */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-8">
               {/* Title / Category / Summary */}
               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
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
                        placeholder="Enter a high-velocity title..."
                        className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-2xl p-5 text-sm outline-none focus:border-(--accent)/30 transition-all placeholder:text-gray-600"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                           Category
                        </label>
                        <select
                           value={formData.category}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 category: e.target.value,
                              }))
                           }
                           className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-2xl p-5 text-sm outline-none focus:border-(--accent)/30 transition-all appearance-none cursor-pointer"
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
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 summary: e.target.value,
                              }))
                           }
                           placeholder="Brief elevator pitch..."
                           className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-2xl p-5 text-sm outline-none focus:border-(--accent)/30 transition-all placeholder:text-gray-600"
                        />
                     </div>
                  </div>
               </section>

               {/* Markdown Editor */}
               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-(--text-main)/5">
                     <div className="flex items-center gap-1">
                        <button
                           onClick={() => insertMarkdown("**", "**")}
                           className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all cursor-pointer"
                           title="Bold"
                        >
                           <Bold size={16} />
                        </button>
                        <button
                           onClick={() => insertMarkdown("*", "*")}
                           className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all cursor-pointer"
                           title="Italic"
                        >
                           <Italic size={16} />
                        </button>
                        <button
                           onClick={() => insertMarkdown("\n- ")}
                           className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all cursor-pointer"
                           title="List"
                        >
                           <List size={16} />
                        </button>

                        <div className="w-px h-5 bg-(--text-main)/10 mx-2"></div>

                        <button
                           onClick={() => insertMarkdown("[", "](url)")}
                           className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all cursor-pointer"
                           title="Link"
                        >
                           <Link2 size={16} />
                        </button>
                        <button
                           onClick={() => insertMarkdown("![alt](", ")")}
                           className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all cursor-pointer"
                           title="Image"
                        >
                           <ImageIcon size={16} />
                        </button>
                        <button
                           onClick={() => insertMarkdown("`", "`")}
                           className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all cursor-pointer"
                           title="Code"
                        >
                           <Code size={16} />
                        </button>
                     </div>
                     <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        Markdown Enabled
                     </span>
                  </div>

                  {/* Text Area */}
                  <textarea
                     ref={textareaRef}
                     value={formData.content}
                     onChange={(e) =>
                        setFormData((prev) => ({ ...prev, content: e.target.value }))
                     }
                     placeholder="Start your digital kinetic narrative here..."
                     className="w-full bg-transparent p-8 text-sm text-(--text-main) outline-none resize-none min-h-[400px] placeholder:text-gray-700 leading-relaxed"
                  />

                  {/* Footer */}
                  <div className="flex items-center justify-between px-8 py-4 border-t border-(--text-main)/5">
                     <span className="text-[10px] font-bold text-gray-600">
                        Word Count: {wordCount}
                     </span>
                     <span className="text-[10px] font-bold text-(--accent)">
                        {autosaved || ""}
                     </span>
                  </div>
               </section>
            </div>

            {/* Right Column – Metadata */}
            <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-8">
               {/* Featured Image */}
               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                     Featured Image
                  </h3>
                  {formData.featuredImage ? (
                     <div className="relative rounded-2xl overflow-hidden">
                        <img
                           src={formData.featuredImage}
                           alt="Featured"
                           className="w-full h-40 object-cover"
                        />
                        <button
                           onClick={() =>
                              setFormData((prev) => ({ ...prev, featuredImage: "" }))
                           }
                           className="absolute top-3 right-3 w-8 h-8 bg-(--bg-dark)/60 rounded-full flex items-center justify-center text-(--text-main) hover:text-red-400 transition-colors cursor-pointer"
                        >
                           <X size={14} />
                        </button>
                     </div>
                  ) : (
                     <label className="flex flex-col items-center justify-center h-40 bg-(--bg-dark) border-2 border-dashed border-(--accent)/20 rounded-2xl cursor-pointer hover:bg-(--bg-dark) hover:border-(--accent)/40 transition-all group">
                        <Upload
                           size={28}
                           className="text-(--accent) mb-3 group-hover:scale-110 transition-transform"
                        />
                        <p className="text-[11px] font-bold text-gray-400">
                           Click to upload image
                        </p>
                        <p className="text-[9px] text-gray-600 mt-1">
                           SVG, PNG, JPG (max. 5MB)
                        </p>
                        <input
                           type="text"
                           className="hidden"
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 featuredImage: e.target.value,
                              }))
                           }
                        />
                     </label>
                  )}
                  {/* URL input as fallback */}
                  <input
                     type="text"
                     value={formData.featuredImage}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           featuredImage: e.target.value,
                        }))
                     }
                     placeholder="Or paste image URL..."
                     className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-xl p-3 text-xs outline-none focus:border-(--accent)/30 transition-all mt-4 placeholder:text-gray-700"
                  />
               </section>

               {/* Metadata – Tags & SEO */}
               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-(--accent) uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <span className="text-base">⚙</span> Metadata
                  </h3>

                  {/* Tags */}
                  <div className="mb-6">
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Tags
                     </label>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag) => (
                           <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--accent)/10 text-(--accent) text-[10px] font-bold"
                           >
                              #{tag}
                              <button
                                 onClick={() => removeTag(tag)}
                                 className="hover:text-red-400 transition-colors cursor-pointer"
                              >
                                 <X size={10} />
                              </button>
                           </span>
                        ))}
                     </div>
                     <div className="flex bg-(--bg-dark) border border-(--text-main)/5 rounded-xl overflow-hidden focus-within:border-(--accent)/30 transition-all">
                        <input
                           type="text"
                           value={newTag}
                           onChange={(e) => setNewTag(e.target.value)}
                           onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                           placeholder="Add tag + Enter"
                           className="flex-grow bg-transparent p-3 text-xs outline-none placeholder:text-gray-700 text-gray-300"
                        />
                     </div>
                  </div>

                  {/* SEO Description */}
                  <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                        SEO Description
                     </label>
                     <textarea
                        rows={3}
                        value={formData.seoDescription}
                        onChange={(e) =>
                           setFormData((prev) => ({
                              ...prev,
                              seoDescription: e.target.value,
                           }))
                        }
                        placeholder="Optimal SEO description (max 160 chars)"
                        maxLength={160}
                        className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-xl p-3 text-xs outline-none focus:border-(--accent)/30 transition-all resize-none placeholder:text-gray-700"
                     />
                  </div>
               </section>

               {/* Status & Visibility */}
               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-(--accent) uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <Zap size={14} className="fill-(--accent)" /> Status & Visibility
                  </h3>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-500">Visibility</span>
                        <select
                           value={formData.visibility}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 visibility: e.target.value,
                              }))
                           }
                           className="bg-transparent text-(--accent) text-right outline-none cursor-pointer appearance-none font-bold"
                        >
                           <option value="Public">Public</option>
                           <option value="Private">Private</option>
                        </select>
                     </div>

                     <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-500">Publish Date</span>
                        <span className="text-(--text-main)">Immediately</span>
                     </div>

                      <div className="flex flex-col gap-2 text-xs font-bold w-full">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 uppercase tracking-widest text-[9px]">URL Slug</span>
                            <button 
                                onClick={() => {
                                    const newSlug = formData.title
                                        .toLowerCase()
                                        .replace(/[^a-z0-9\s-]/g, "")
                                        .replace(/\s+/g, "-")
                                        .replace(/-+/g, "-")
                                        .replace(/^-+|-+$/g, "")
                                        .trim();
                                    setFormData(prev => ({ ...prev, slug: newSlug }));
                                }}
                                className="text-(--accent) text-[9px] hover:underline"
                            >
                                Regenerate
                            </button>
                        </div>
                        <input 
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="bg-(--bg-dark) border border-(--text-main)/5 rounded-xl p-3 text-(--accent) font-mono text-[11px] outline-none focus:border-(--accent)/30 transition-all"
                            placeholder="e.g. my-awesome-post"
                        />
                      </div>

                     <div className="border-t border-(--text-main)/5 pt-4 mt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <div
                              onClick={() =>
                                 setFormData((prev) => ({
                                    ...prev,
                                    promoted: !prev.promoted,
                                 }))
                              }
                              className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
                                 formData.promoted
                                    ? "bg-(--accent)"
                                    : "bg-(--bg-less-dark)"
                              }`}
                           >
                              <div
                                 className={`w-5 h-5 rounded-full bg-(--text-main) absolute top-0.5 transition-all shadow-md ${
                                    formData.promoted ? "left-[26px]" : "left-0.5"
                                 }`}
                              ></div>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-300">
                              Promote on Dashboard
                           </span>
                        </label>
                        {formData.promoted && (
                           <p className="text-[9px] text-red-400 mt-2 font-bold uppercase tracking-wider">
                              Note: This will remove the current promoting blog.
                           </p>
                        )}
                     </div>
                  </div>
               </section>
            </div>
         </div>
      </div>
   );
}
