"use client";

import React, { useEffect } from "react";
import {
  ArrowRight,
  Lightbulb,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BlogDetailClient({ post, readNextPosts }: { post: any, readNextPosts: any[] }) {
  const router = useRouter();

  // Reset scroll position when post changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post?.id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg-dark) text-(--text-main)">
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
    <div className="flex flex-col items-center justify-center" >
      {/* blog page header / title */}
      <div className="h-[60dvh] w-dvw flex gap-10 flex-col items-center justify-center font-bold" style={{ backgroundImage: "url('/BlogsDetailsHeaderImage.png')", backgroundSize: "cover", backgroundPosition: "center" }} >
        <h1 className="text-[8rem] leading-none max-w-6/10 text-center font-grotesk mt-20" >
          {post.title.split(" ").map((word: string, i: number, arr: string[]) =>
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
        <div className="w-4/6">
          <div className="h-fit">
            <article className="prose prose-invert max-w-none 
              prose-h2:text-3xl prose-h3:text-2xl prose-h2:font-grotesk prose-h3:font-grotesk
              prose-p:font-inter prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg
              prose-h2:text-(--text-main) prose-h3:text-(--text-main) prose-strong:text-(--text-main) prose-li:text-gray-400
              prose-blockquote:border-l-(--accent) prose-blockquote:bg-(--text-main)/[0.02] prose-blockquote:p-8 prose-blockquote:rounded-r-3xl text-xl font-inter"
              dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        <div className="w-2/6 relative">
          <div className="sticky top-50">
            <div className="h-fit flex flex-col gap-10">
              <div className="rounded-[40px] h-fit bg-(--bg-less-dark) p-10">
                <h1 className="text-(--accent) font-grotesk text-4xl font-bold flex items-center justify-start gap-5" ><Lightbulb size={40} /> Key Takeaways</h1>
                <div className=" text-xl font-inter flex flex-col gap-5 mt-10 p-5" >
                  {post.keyTakeaways.map((item: string, i: number) => (
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
        <div className="flex items-center justify-between mb-16">
          <div className="flex flex-col">
            <h1 className="font-grotesk font-bold text-(--accent) text-6xl" >
              Read Next
            </h1>
            <p>Continue exploring the digital frontier with InnovixLLC.</p>
          </div>
          <Link href="/blogs" className="flex gap-5 items-center justify-center button-dark" >
            View all Blogs <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative z-10">
          {readNextPosts.map((nextPost: any) => (
            <Link 
              key={nextPost.id} 
              href={`/blogs/${nextPost.slug || nextPost.id}`}
              className="group cursor-pointer bg-(--text-main)/[0.03] border border-(--text-main)/5 rounded-[40px] overflow-hidden hover:bg-(--text-main)/[0.05] transition-all duration-500 flex flex-col relative z-20"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={nextPost.image} alt={nextPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-(--bg-dark) via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-(--accent) uppercase tracking-[0.2em]">{nextPost.category}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{nextPost.date}</span>
                </div>
                <h3 className="text-xl font-bold font-grotesk mb-4 group-hover:text-(--accent) transition-colors leading-tight line-clamp-2">
                  {nextPost.title}
                </h3>
                <div className="flex items-center justify-between pt-4 border-t border-(--text-main)/5 mt-auto">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                    <Clock size={14} className="text-gray-600" /> {nextPost.readTime}
                  </div>
                  <ArrowRight size={14} className="text-(--accent) group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
