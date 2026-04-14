"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  Clock,
  ChevronRight,
  Filter
} from "lucide-react";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogs";

const CATEGORIES = ["All Posts", "Guides", "Productivity", "Security", "Company News"];

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All Posts" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find(p => p.category === "Featured") || BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-(--bg-dark) text-white pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />

      <div className="w-[80dvw] mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold font-grotesk tracking-tighter mb-6">
            Dive Into our <span className="text-(--accent)">Latest Blogs</span>
          </h1>
          <p className="text-gray-400 text-md font-inter max-w-2/5 leading-relaxed">
            Complete your order for InnovixLLC high-performance digital infrastructure. Your digital assets will be available immediately after verification.
          </p>
        </div>

        {/* Featured Hero Card */}
        <div className="mb-20">
          <div className="block relative group overflow-hidden rounded-[50px] border border-white/5 bg-white/[0.02]">
            {/* <div className=""> */}

            <div className="p-16 h-[60dvh] flex flex-col justify-center items-start" style={{ backgroundImage: "url('/BlogsGradient.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <span className="bg-(--accent)/10 text-(--accent) text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"  >
                Featured Insight
              </span>
              <h2 className="text-6xl font-bold font-grotesk mb-6 max-w-1/2 text-white leading-[1.1]">
                {featuredPost.title.split(" ").map((word, i, arr) =>
                  i >= arr.length - 2 ? (
                    <span key={i} className="text-(--accent)">
                      {word + " "}
                    </span>
                  ) : (
                    word + " "
                  )
                )}
              </h2>
              <p className="text-gray-400 text-xl font-inter mb-10 leading-relaxed max-w-2xl">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-8">
                <Link href={`/blogs/${featuredPost.id}`} className="button-green">
                  Read Featured Article <ArrowRight size={20} />
                </Link>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                  <Clock size={16} /> {featuredPost.readTime}
                </div>
              </div>
            </div>

            {/* </div> */}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat
                  ? "bg-(--accent) text-black shadow-lg shadow-(--accent)/20"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full px-16 py-4 text-sm font-inter focus:outline-none focus:border-(--accent)/30 transition-all"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredPosts.filter(p => p.category !== 'Featured' || (searchQuery !== "" || activeCategory !== "All Posts")).map((post) => (
              <Link key={post.id} href={`/blogs/${post.id}`} className="group bg-white/[0.03] border border-white/5 rounded-[40px] overflow-hidden hover:bg-white/[0.05] transition-all duration-500 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-(--bg-dark) via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-(--accent) uppercase tracking-[0.2em]">{post.category}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-grotesk mb-4 group-hover:text-(--accent) transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-inter leading-relaxed mb-10 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                      <Clock size={14} /> {post.readTime}
                    </div>
                    <span className="flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      Read More <ArrowRight size={14} className="text-(--accent)" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-[50px] mb-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-6 border border-white/5">
              <Search size={40} />
            </div>
            <h3 className="text-3xl font-bold font-grotesk mb-4">No blogs found</h3>
            <p className="text-gray-400 font-inter max-w-sm mb-8 leading-relaxed">
              We couldn't find any articles matching your search query or selected category.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All Posts");
              }}
              className="button-green"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="flex items-center justify-center bg-(--bg-less-dark) rounded-[50px] p-16">
          {/* left section of the newsletter */}
          <div className="w-1/2">
            <h2 className="text-5xl font-bold font-grotesk mb-4">Stay ahead with the <br /><span className="text-(--accent)">Innovix Blogs</span></h2>
            <p className="text-gray-400 text-lg font-inter max-w-xl mb-10">
              Get weekly insights on security, engineering productivity, and the future of digital distribution. No spam, just high-fidelity knowledge.
            </p>
          </div>
          {/* right section of the newsletter */}
          <div className="w-1/2">
            <form className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="w-full flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-sm font-inter focus:outline-none focus:border-(--accent)/30 transition-all"
              />
              <button className="button-green whitespace-nowrap px-10 py-5">
                Join Now <ChevronRight size={20} />
              </button>
            </form>
            <p className="text-[10px] text-right text-gray-600 font-bold uppercase  mt-4">TRUSTED BY 50,000+ DEVELOPERS WORLDWIDE</p>
          </div>
        </div>

      </div>
    </div>
  );
}
