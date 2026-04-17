import { getBlogPosts } from "@/actions/blogs";
import BlogsClient from "./BlogsClient";

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* this is the blogs page wrapper for the background */}
      <div className="bg-(--bg-dark) w-full flex items-center justify-center" >
        <BlogsClient initialPosts={posts as any} />;
      </div>
    </>)
}
