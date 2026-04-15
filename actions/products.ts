"use server";

import { prisma } from "@/lib/prisma";

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return null;

  return {
    ...product,
    price: product.price.toString(), // if Decimal
  };
}

export async function getRelatedProducts(currentId: string) {
  const products = await prisma.product.findMany({
    where: {
      id: { not: currentId },
    },
    take: 4,
  });

  return products.map(p => ({
    ...p,
    price: p.price.toString(),
  }));
}