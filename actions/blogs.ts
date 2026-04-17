"use server";

import { prisma } from "@/lib/prisma";

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "Public",
      },
      include: {
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary || "",
      content: post.content,
      category: post.category,
      date: post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      readTime: "10 min read", // You could calculate this based on content length
      author: {
        name: post.author?.name || "Anonymous",
        role: "Author"
      },
      image: post.featuredImage || "/BlogsPage.png",
      keyTakeaways: post.tags || [],
      promoted: post.promoted,
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary || "",
      content: post.content,
      category: post.category,
      date: post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      readTime: "10 min read",
      author: {
        name: post.author?.name || "Anonymous",
        role: "Author"
      },
      image: post.featuredImage || "/BlogsPage.png",
      keyTakeaways: post.tags || [],
      promoted: post.promoted,
    };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

export async function getBlogPostById(id: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: id.match(/^[0-9a-fA-F]{24}$/)
        ? { OR: [{ id }, { slug: id }] }
        : { slug: id },
      include: {
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary || "",
      content: post.content,
      category: post.category,
      date: post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      readTime: "10 min read",
      author: {
        name: post.author?.name || "Anonymous",
        role: "Author"
      },
      image: post.featuredImage || "/BlogsPage.png",
      keyTakeaways: post.tags || [],
      promoted: post.promoted,
    };
  } catch (error) {
    console.error("Error fetching blog post by id/slug:", error);
    return null;
  }
}

export async function getReadNextPosts(excludeId: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        id: { not: excludeId },
        status: "PUBLISHED",
        visibility: "Public",
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary || "",
      category: post.category,
      date: post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      readTime: "10 min read",
      image: post.featuredImage || "/BlogsPage.png",
    }));
  } catch (error) {
    console.error("Error fetching read next posts:", error);
    return [];
  }
}
