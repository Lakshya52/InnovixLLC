"use server"

import { prisma } from "@/lib/prisma";

export async function getProducts({
  skip = 0,
  limit = 5,
  search = "",
  category = "All",
  sortBy = "Popular"
}: {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
}) {
  const where: any = {
    status: 'Live',
  };

  if (category !== "All") {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { shortDescription: { contains: search } }
    ];
  }

  let orderBy: any = { updatedAt: 'desc' };
  if (sortBy === "Price: Low to High") orderBy = { price: 'asc' };
  if (sortBy === "Price: High to Low") orderBy = { price: 'desc' };
  if (sortBy === "Name: A-Z") orderBy = { name: 'asc' };

  try {
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        status: true,
        image: true,
        features: true,
        _count: {
          select: {
            stockKeys: {
              where: { isSold: false }
            }
          }
        }
      }
    });

    const totalCount = await prisma.product.count({ where });

    return {
      products: JSON.parse(JSON.stringify(products.map(p => ({
        ...p,
        stockKeys: { length: p._count.stockKeys }
      })))),
      totalCount
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
  }
}
