import React from "react";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: 'Live' },
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
  });

  // Transform products to match the expected format in ProductsClient and ProductCard
  // We use a getter for length to simulate the stockKeys array without sending the data
  const initialProducts = products.map(p => ({
    ...p,
    stockKeys: { length: p._count.stockKeys } 
  }));

  return (
    <ProductsClient 
        initialProducts={JSON.parse(JSON.stringify(initialProducts))} 
    />
  );
}
