import { getBlogPostById, getReadNextPosts } from "@/actions/blogs";
import BlogDetailClient from "./BlogDetailClient";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getBlogPostById(decodedSlug);
  const readNextPosts = post ? await getReadNextPosts(post.id) : [];
  
  return <BlogDetailClient key={post?.id || decodedSlug} post={post} readNextPosts={readNextPosts} />;
}
