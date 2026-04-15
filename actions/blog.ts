"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super_secret_key_innovix_llc_replace_me"
);

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) throw new Error("No session");

  const { payload } = await jwtVerify(token, JWT_SECRET);
  console.log("JWT PAYLOAD:", payload);
  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
  });
  if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");
  return user;
}

export async function getBlogs(page = 1, perPage = 6) {
  const skip = (page - 1) * perPage;
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: { author: { select: { name: true, email: true } } },
    }),
    prisma.blogPost.count(),
  ]);

  return {
    posts: posts.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      publishDate: p.publishDate?.toISOString() || null,
    })),
    total,
    pages: Math.ceil(total / perPage),
  };
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  seoDescription?: string;
  featuredImage?: string;
  status: string;
  visibility: string;
  promoted: boolean;
  publishDate?: string | null;
}) {
  const admin = await getAdminUser();

  // If promoting this post, demote all others first
  if (data.promoted) {
    await prisma.blogPost.updateMany({
      where: { promoted: true },
      data: { promoted: false },
    });
  }

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      summary: data.summary || null,
      category: data.category,
      tags: data.tags,
      seoDescription: data.seoDescription || null,
      featuredImage: data.featuredImage || null,
      status: data.status,
      visibility: data.visibility,
      promoted: data.promoted,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      authorId: admin.id,
    },
  });

  return { success: true, id: post.id };
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    summary?: string;
    category?: string;
    tags?: string[];
    seoDescription?: string;
    featuredImage?: string;
    status?: string;
    visibility?: string;
    promoted?: boolean;
    publishDate?: string | null;
  }
) {
  await getAdminUser();

  if (data.promoted) {
    await prisma.blogPost.updateMany({
      where: { promoted: true, id: { not: id } },
      data: { promoted: false },
    });
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
    },
  });

  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await getAdminUser();
  await prisma.blogPost.delete({ where: { id } });
  return { success: true };
}
