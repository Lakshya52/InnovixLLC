import { getBlogs } from "@/actions/blog";
import BlogsClient from "./BlogsClient";

export default async function AdminBlogsPage() {
  const data = await getBlogs(1, 6);

  return <BlogsClient initialData={data} />;
}
