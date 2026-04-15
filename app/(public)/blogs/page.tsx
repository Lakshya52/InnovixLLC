import { getBlogPosts } from "@/actions/blogs";
import BlogsClient from "./BlogsClient";

export default async function BlogsPage() {
  const posts = await getBlogPosts();
  
  return <BlogsClient initialPosts={posts as any} />;
}
