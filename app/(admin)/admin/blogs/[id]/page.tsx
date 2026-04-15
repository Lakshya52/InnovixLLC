import { getBlogPostById } from "@/actions/blogs";
import EditBlogPostClient from "./EditBlogPostClient";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;
   const post = await getBlogPostById(id);

   if (!post) {
      notFound();
   }

   return <EditBlogPostClient post={post} />;
}
