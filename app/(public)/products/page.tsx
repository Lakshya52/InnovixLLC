import React from "react";
import ProductsClient from "./ProductsClient";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: 'Live' },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <ProductsClient 
        initialProducts={JSON.parse(JSON.stringify(products))} 
    />
  );
}
