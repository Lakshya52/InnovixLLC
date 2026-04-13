"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lightbulb,
  Share2,
  // Twitter, 
  // Linkedin, 
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blogs";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-dark) text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <button onClick={() => router.push('/blogs')} className="button-green">
            Return to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-(--bg-dark) text-white pt-32 pb-20 relative overflow-hidden">
    //   {/* Background design elements */}
    //   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />
    //   <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />

    //   <div className="max-w-[700px] mx-auto px-6">
    //     {/* Navigation */}
    //     <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-(--accent) transition-colors font-bold uppercase text-[10px] mb-12">
    //       <ArrowLeft size={16} /> Back to Blogs
    //     </Link>

    //     {/* Header Section */}
    //     <div className="mb-12">
    //       <div className="flex items-center gap-4 mb-6">
    //         <span className="bg-(--accent)/10 text-(--accent) text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full">
    //           {post.category}
    //         </span>
    //         <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
    //           <Clock size={14} /> {post.readTime}
    //         </div>
    //       </div>
    //       <h1 className="text-6xl font-bold font-grotesk tracking-tighter leading-[0.9] mb-8">
    //         {post.title}
    //       </h1>
    //       <div className="flex items-center justify-between py-8 border-y border-white/5">
    //         {/* <div className="flex items-center gap-4">
    //           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
    //             <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${post.author.name}`} alt={post.author.name} />
    //           </div>
    //           <div>
    //             <p className="font-bold text-sm tracking-tight">{post.author.name}</p>
    //             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.author.role}</p>
    //           </div>
    //         </div> */}
    //         <div className="flex items-center gap-3">
    //           <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
    //             {/* <Twitter size={16} /> */} twitter
    //           </button>
    //           <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
    //             {/* <Linkedin size={16} /> */} linkedin
    //           </button>
    //           <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
    //             <LinkIcon size={16} />
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Featured Image */}
    //     <div className="mb-16 rounded-[40px] overflow-hidden border border-white/5 relative aspect-video">
    //       <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
    //       {/* <img src="/BlogsDetailsHeaderImage.png" alt={post.title} className="w-full h-full object-cover" /> */}
    //     </div>

    //     {/* Content Section */}
    //     <article className="prose prose-invert max-w-none 
    //       prose-h2:text-3xl prose-h3:text-2xl prose-h2:font-grotesk prose-h3:font-grotesk
    //       prose-p:font-inter prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg
    //       prose-h2:text-white prose-h3:text-white prose-strong:text-white prose-li:text-gray-400
    //       prose-blockquote:border-l-(--accent) prose-blockquote:bg-white/[0.02] prose-blockquote:p-8 prose-blockquote:rounded-r-3xl
    //     "
    //       dangerouslySetInnerHTML={{ __html: post.content }} />

    //     {/* Footer Navigation */}
    //     <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between">
    //       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Published on {post.date}</p>
    //       <div className="flex items-center gap-4">
    //         <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Share this article</span>
    //         <Share2 size={16} className="text-(--accent)" />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="flex flex-col items-center justify-center" >
        {/* blog page header / title */}
        <div className="h-[60dvh] w-dvw flex gap-10 flex-col items-center justify-center font-bold" style={{ backgroundImage: "url('/BlogsDetailsHeaderImage.png')", backgroundSize: "cover", backgroundPosition: "center" }} >
          {/* {post.title} */}

          <h1 className="text-[8rem] leading-none max-w-6/10 text-center font-grotesk mt-20" >
            {post.title.split(" ").map((word, i, arr) =>
              i >= arr.length - 2 ? (
                <span key={i} className="text-(--accent)">
                  {word + " "}
                </span>
              ) : (
                word + " "
              )
            )}
          </h1>
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <span className=" text-(--text-main)/50" >PUBLISHED ON</span>
              <span className="font-grotesk text-xl" >{post.date}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className=" text-(--text-main)/50" >READING TIME</span>
              <span className="font-grotesk text-xl" >{post.readTime}</span>
            </div>

          </div>
        </div>
        {/* content and key takeaways section */}
        <div className="flex justify-between w-[80dvw] mx-auto my-20 gap-10">

          {/* LEFT (scrolls normally) */}
          <div className="w-4/6">
            <div className="h-fit">
              <article className="prose prose-invert max-w-none 
          prose-h2:text-3xl prose-h3:text-2xl prose-h2:font-grotesk prose-h3:font-grotesk
          prose-p:font-inter prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg
          prose-h2:text-white prose-h3:text-white prose-strong:text-white prose-li:text-gray-400
          prose-blockquote:border-l-(--accent) prose-blockquote:bg-white/[0.02] prose-blockquote:p-8 prose-blockquote:rounded-r-3xl text-xl font-inter"
                dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

          </div>

          {/* RIGHT (sticky) */}
          <div className="w-2/6 relative">
            <div className="sticky top-50">
              <div className="h-fit flex flex-col gap-10">
                <div className="rounded-[40px] h-fit bg-(--bg-less-dark) p-10">

                  <h1 className="text-(--accent) font-grotesk text-4xl font-bold flex items-center justify-start gap-5" ><Lightbulb size={40} /> Key Takeaways</h1>

                  <div className=" text-xl font-inter flex flex-col gap-5 mt-10 p-5" >
                    {post.keyTakeaways.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-(--accent)">{i < 9 ? "0" : null}{i + 1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </div>

                </div>
                <div className="rounded-[40px] flex flex-col h-fit bg-(--bg-less-dark) p-10 gap-10">
                  <div className=" ">
                    <h1 className="text-4xl font-grotesk font-bold text-(--accent)" >
                      Innovix Insider
                    </h1>
                    <p className="text-xl mt-2" >
                      Get our weekly technical deep-dives
                      delivered straight to your inbox.</p>
                  </div>
                  <div>
                    <input type="email" className="w-full text-md p-5 bg-(--bg-dark) rounded-full" placeholder="Enter Your email" />
                    <button className="button-green mt-5 rounded-full w-full text-xl flex items-center justify-center py-10"  >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className=" w-[80dvw]">

          <div className="flex items-center justify-between">

            <div className="flex flex-col">

              <h1 className="font-grotesk font-bold text-(--accent) text-6xl" >
                Read Next
              </h1>
              <p>Continue exploring the digital frontier with InnovixLLC.</p>
            </div>
            <button className="flex gap-5 items-center justify-center button-dark" >
              View all Blogs <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
