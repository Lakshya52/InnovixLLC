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
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
   toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
         { list: "ordered" },
         { list: "bullet" },
         { indent: "-1" },
         { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
   ],
   clipboard: {
      matchVisual: false,
   },
};

const formats = [
   "header",
   "font",
   "size",
   "bold",
   "italic",
   "underline",
   "strike",
   "blockquote",
   "list",
   "indent",
   "color",
   "background",
   "link",
   "image",
   "video",
];

export default function EditBlogPostClient({ post }: { post: any }) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [autosaved, setAutosaved] = useState<string | null>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

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
         setFormData((prev) => ({ ...prev, featuredImage: base64 }));
      };
      reader.readAsDataURL(file);
   };

   const removeImage = () => {
      setFormData((prev) => ({ ...prev, featuredImage: "" }));
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

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
         tags: prev.tags.filter((t: any) => t !== tag),
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
                  <span className="text-(--accent)">Edit Post</span>
               </div>
               <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Edit <span className="text-(--accent)">Blog Post</span>
               </h1>
            </div>
            <div className="flex items-center gap-4">
               <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-10 py-4 rounded-full font-bold text-sm bg-(--accent) text-(--bg-dark) hover:bg-(--accent) transition-all cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-95 disabled:opacity-50"
               >
                  {loading ? "Saving..." : "Save Changes"}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-8">
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
                        className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-2xl p-5 text-sm outline-none focus:border-(--accent)/30 transition-all text-(--text-main)"
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
                           onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                           className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-2xl p-5 text-sm outline-none focus:border-(--accent)/30 transition-all"
                        />
                     </div>
                  </div>
               </section>

               <section className="bg-white border border-(--text-main)/5 rounded-[32px] overflow-hidden text-black mb-8 p-4">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                     <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        Rich Text Editor
                     </span>
                  </div>

                  <div className="quill-editor-wrapper">
                     <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) =>
                           setFormData((prev) => ({ ...prev, content }))
                        }
                        modules={modules}
                        formats={formats}
                        className="bg-white min-h-[400px]"
                     />
                  </div>

                  <style jsx global>{`
                     .quill-editor-wrapper .ql-container {
                        min-height: 400px;
                        font-family: inherit;
                        font-size: 14px;
                     }
                     .quill-editor-wrapper .ql-toolbar {
                        border-top-left-radius: 0.5rem;
                        border-top-right-radius: 0.5rem;
                        background: #f9fafb;
                     }
                  `}</style>

                  <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200">
                     <span className="text-[10px] font-bold text-gray-600">Word Count: {wordCount}</span>
                  </div>
               </section>
            </div>

            <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-8">
               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Featured Image</h3>
                  {formData.featuredImage ? (
                     <div className="relative rounded-[24px] overflow-hidden mb-4">
                        <img src={formData.featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                        <button onClick={removeImage} className="absolute top-3 right-3 p-2 bg-(--bg-dark)/60 backdrop-blur-sm rounded-full text-(--text-main) hover:text-red-400 transition-colors cursor-pointer"><X size={14} /></button>
                     </div>
                  ) : (
                     <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center h-40 bg-(--bg-dark) border-2 border-dashed border-(--accent)/20 rounded-2xl cursor-pointer hover:bg-(--bg-dark) hover:border-(--accent)/40 transition-all group mb-4"
                     >
                        <Upload
                           size={28}
                           className="text-(--accent) mb-3 group-hover:scale-110 transition-transform"
                        />
                        <p className="text-[11px] font-bold text-gray-400">
                           Click to upload image
                        </p>
                        <p className="text-[9px] text-gray-600 mt-1">
                           PNG, JPG, WebP (max. 5MB)
                        </p>
                     </div>
                  )}
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/png,image/jpeg,image/webp"
                     onChange={handleImageSelect}
                     className="hidden"
                  />
                  <input
                     type="text"
                     value={formData.featuredImage && !formData.featuredImage.startsWith("data:") ? formData.featuredImage : ""}
                     onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                     placeholder="Or paste image URL..."
                     className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-xl p-3 text-xs outline-none focus:border-(--accent)/30 transition-all placeholder:text-gray-700"
                  />
               </section>

               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-(--accent) uppercase tracking-[0.2em] mb-6">Metadata</h3>
                  <div className="mb-6">
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Tags</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag: any) => (
                           <span key={tag} className="px-3 py-1.5 rounded-full bg-(--accent)/10 text-(--accent) text-[10px] font-bold flex items-center gap-1">
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
                        className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-xl p-3 text-xs outline-none"
                     />
                  </div>
               </section>

               <section className="bg-(--bg-dark) border border-(--text-main)/5 rounded-[32px] p-8">
                  <h3 className="text-[10px] font-bold text-(--accent) uppercase tracking-[0.2em] mb-6">Slug & Status</h3>
                  <div className="space-y-4">
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                           <span className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">URL Slug</span>
                           <button
                              onClick={() => setManualSlug(false)}
                              className="text-(--accent) text-[9px] font-bold uppercase"
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
                           className="w-full bg-(--bg-dark) border border-(--text-main)/5 rounded-xl p-3 text-(--accent) font-mono text-xs outline-none focus:border-(--accent)/30 transition-all"
                        />
                     </div>

                     <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-(--text-main)/5">
                        <span className="text-gray-500">Status</span>
                        <select
                           value={formData.status}
                           onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                           className="bg-transparent text-(--accent) outline-none cursor-pointer font-bold"
                        >
                           <option value="PUBLISHED">Published</option>
                           <option value="DRAFT">Draft</option>
                           <option value="ARCHIVED">Archived</option>
                        </select>
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
                              className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${formData.promoted
                                    ? "bg-(--accent)"
                                    : "bg-(--bg-less-dark)"
                                 }`}
                           >
                              <div
                                 className={`w-5 h-5 rounded-full bg-(--text-main) absolute top-0.5 transition-all shadow-md ${formData.promoted ? "left-[26px]" : "left-0.5"
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
