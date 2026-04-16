"use client";

import React, { useState } from "react";
import {
   ChevronLeft,
   ChevronRight,
   Plus,
   TrendingUp,
   FileText,
   Pencil,
   Trash2,
   Eye,
   Calendar,
   Clock,
   BarChart3,
} from "lucide-react";
import Link from "next/link";
import { getBlogs, deleteBlogPost } from "@/actions/blog";

interface BlogPost {
   id: string;
   title: string;
   slug: string;
   content: string;
   summary: string | null;
   category: string;
   tags: string[];
   seoDescription: string | null;
   featuredImage: string | null;
   status: string;
   visibility: string;
   publishDate: string | null;
   promoted: boolean;
   authorId: string;
   author: { name: string | null; email: string };
   createdAt: string;
   updatedAt: string;
}

interface BlogData {
   posts: BlogPost[];
   total: number;
   pages: number;
}

export default function BlogsClient({ initialData }: { initialData: BlogData }) {
   const [data, setData] = useState<BlogData>(initialData);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);

   const loadPage = async (p: number) => {
      setLoading(true);
      try {
         const res = await getBlogs(p, 6);
         setData(res as BlogData);
         setPage(p);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this blog post?")) return;
      try {
         await deleteBlogPost(id);
         loadPage(page);
      } catch (err) {
         console.error(err);
         alert("Failed to delete post");
      }
   };

   const getCategoryColor = (cat: string) => {
      const colors: Record<string, string> = {
         Infrastructure: "bg-(--accent) text-(--bg-dark)",
         Engineering: "bg-blue-500 text-(--text-main)",
         Security: "bg-orange-500 text-(--text-main)",
         Licensing: "bg-purple-500 text-(--text-main)",
         Product: "bg-cyan-500 text-(--bg-dark)",
         General: "bg-gray-500 text-(--text-main)",
      };
      return colors[cat] || "bg-(--accent) text-(--bg-dark)";
   };

   const getStatusBadge = (status: string) => {
      if (status === "PUBLISHED")
         return (
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
               <span className="w-2 h-2 rounded-full bg-(--accent) shadow-[0_0_8px_#6eDD86]"></span>
               <span className="text-(--accent)">Published</span>
            </span>
         );
      if (status === "SCHEDULED")
         return (
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
               <Pencil size={10} className="text-yellow-500" />
               <span className="text-yellow-500">Draft</span>
            </span>
         );
      return (
         <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
            <Pencil size={10} className="text-yellow-500" />
            <span className="text-yellow-500">Draft</span>
         </span>
      );
   };

   // Placeholder images for blog cards
   const placeholderImages = [
      "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&q=80",
   ];

   // Growth calculation (static for now)
   const growthPercent = data.total > 0 ? "+12.5%" : "0%";

   return (
      <div className="p-8 mx-auto w-full">
         {/* Header Section */}
         <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-16 mt-10">
            <div>
               <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  Blog <span className="text-(--accent)">Management</span>
               </h1>
               <p className="text-(--text-main) text-sm max-w-lg leading-relaxed">
                  Curate and manage your high-performance content pipeline. Publish
                  technical updates and industry insights.
               </p>
            </div>

            {/* Total Posts Card */}
            <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[28px] p-6 pr-8 flex items-center gap-6 min-w-[260px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-(--accent)/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
               <div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">
                     Total Posts
                  </p>
                  <h2 className="text-4xl font-bold text-(--text-main)">{data.total}</h2>
               </div>
               <div className="p-3 bg-(--bg-dark) rounded-2xl text-gray-600 border border-(--bg-dark)">
                  <FileText size={28} />
               </div>
               <div className="absolute bottom-4 left-6">
                  <span className="flex items-center gap-1 text-(--accent) text-[10px] font-bold">
                     <TrendingUp size={12} /> {growthPercent} this month
                  </span>
               </div>
            </div>
         </div>

         {/* Recent Articles Header */}
         <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            <Link href="/admin/blogs/new">
               <button className="flex items-center gap-2 bg-(--bg-dark) border border-(--bg-less-dark) text-(--text-main) px-6 py-3 rounded-full font-bold text-sm hover:bg-[#222] hover:border-(--accent)/30 transition-all cursor-pointer">
                  <Plus size={18} className="text-(--accent)" />
                  New Post
               </button>
            </Link>
         </div>

         {/* Blog Cards Grid */}
         {loading ? (
            <div className="flex items-center justify-center py-32">
               <div className="w-8 h-8 border-4 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
            </div>
         ) : data.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
               <div className="w-20 h-20 bg-(--bg-dark) border border-(--bg-dark) rounded-full flex items-center justify-center mb-6">
                  <FileText size={32} className="text-gray-600" />
               </div>
               <h3 className="text-xl font-bold mb-2">No articles yet</h3>
               <p className="text-gray-500 text-sm mb-8 max-w-md">
                  Start building your content pipeline. Write your first blog post to
                  share industry insights and updates.
               </p>
               <Link href="/admin/blogs/new">
                  <button className="flex items-center gap-2 bg-(--accent) text-(--bg-dark) px-8 py-3 rounded-full font-bold text-sm hover:bg-(--accent) transition-all cursor-pointer shadow-[0_0_20px_rgba(110,221,134,0.2)]">
                     <Plus size={18} />
                     Create First Post
                  </button>
               </Link>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
               {data.posts.map((post, idx) => (
                  <div
                     key={post.id}
                     className="bg-(--bg-dark) border border-(--bg-dark) rounded-[28px] overflow-hidden group hover:border-(--bg-less-dark) transition-all duration-300 flex flex-col"
                  >
                     {/* Card Image */}
                     <div className="relative h-[200px] overflow-hidden">
                        <img
                           src={post.featuredImage || placeholderImages[idx % placeholderImages.length]}
                           alt={post.title}
                           className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                           <span
                              className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${getCategoryColor(post.category)}`}
                           >
                              {post.category}
                           </span>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute bottom-4 left-4">
                           {getStatusBadge(post.status)}
                        </div>
                     </div>

                     {/* Card Content */}
                     <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold leading-tight mb-4 line-clamp-2 group-hover:text-(--accent) transition-colors">
                           {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-auto">
                           <span className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {post.status === "SCHEDULED" && post.publishDate
                                 ? `Scheduled: ${new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                                 : new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                 })}
                           </span>
                           <span className="text-gray-700">•</span>
                           <span className="text-(--accent) font-bold">
                              {post.author.name || "Admin"}
                           </span>
                        </div>
                     </div>

                     {/* Card Actions */}
                     <div className="px-6 pb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <button className="w-10 h-10 rounded-full bg-(--bg-dark) border border-(--bg-dark) flex items-center justify-center text-gray-500 hover:text-(--accent) hover:border-(--accent)/30 transition-all cursor-pointer">
                              <BarChart3 size={16} />
                           </button>
                           <Link href={`/admin/blogs/${post.id}`}>
                              <button className="w-10 h-10 rounded-full bg-(--bg-dark) border border-(--bg-dark) flex items-center justify-center text-gray-500 hover:text-(--accent) hover:border-(--accent)/30 transition-all cursor-pointer">
                                 <Pencil size={16} />
                              </button>
                           </Link>
                        </div>
                        <button
                           onClick={() => handleDelete(post.id)}
                           className="w-10 h-10 rounded-full bg-(--bg-dark) border border-(--bg-dark) flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Pagination */}
         {data.pages > 1 && (
            <div className="flex items-center justify-between">
               <p className="text-gray-500 text-sm">
                  Showing {data.posts.length} of {data.total} articles
               </p>
               <div className="flex items-center gap-2">
                  <button
                     onClick={() => loadPage(Math.max(1, page - 1))}
                     disabled={page === 1}
                     className="w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-dark) border border-(--bg-dark) text-gray-500 hover:text-(--text-main) hover:border-(--bg-less-dark) transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                     <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(data.pages, 5) }, (_, i) => i + 1).map(
                     (p) => (
                        <button
                           key={p}
                           onClick={() => loadPage(p)}
                           className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all cursor-pointer ${
                              p === page
                                 ? "bg-(--accent) text-(--bg-dark)"
                                 : "bg-(--bg-dark) border border-(--bg-dark) text-gray-400 hover:text-(--text-main) hover:border-(--bg-less-dark)"
                           }`}
                        >
                           {p}
                        </button>
                     )
                  )}
                  <button
                     onClick={() => loadPage(Math.min(data.pages, page + 1))}
                     disabled={page === data.pages}
                     className="w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-dark) border border-(--bg-dark) text-gray-500 hover:text-(--text-main) hover:border-(--bg-less-dark) transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                     <ChevronRight size={16} />
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
