import React from "react";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'Live' },
      take: 5,
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
      },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.product.count({ where: { status: 'Live' } })
  ]);

  // Transform products to match the expected format
  const initialProducts = products.map(p => ({
    ...p,
    stockKeys: { length: p._count.stockKeys } 
  }));

  return (
    <ProductsClient 
        initialProducts={JSON.parse(JSON.stringify(initialProducts))} 
        initialTotalCount={totalCount}
    />
  );
}
