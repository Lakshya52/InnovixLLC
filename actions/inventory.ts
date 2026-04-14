"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");
  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Forbidden");
  return payload;
}

export async function createProduct(data: {
  name: string;
  category: string;
  price: number;
  msrp?: number;
  sku?: string;
  shortDescription?: string;
  description?: string;
  longDescriptionTwo?: string;
  featureHeading?: string;
  status?: string;
  minCPU?: string;
  minRAM?: string;
  minStorage?: string;
  minGPU?: string;
  recCPU?: string;
  recRAM?: string;
  recStorage?: string;
  recGPU?: string;
  features?: string[];
}) {
  await checkAdmin();

  const product = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      msrp: data.msrp,
      sku: data.sku,
      shortDescription: data.shortDescription,
      description: data.description,
      longDescriptionTwo: data.longDescriptionTwo,
      featureHeading: data.featureHeading,
      status: data.status || "Live",
      minCPU: data.minCPU,
      minRAM: data.minRAM,
      minStorage: data.minStorage,
      minGPU: data.minGPU,
      recCPU: data.recCPU,
      recRAM: data.recRAM,
      recStorage: data.recStorage,
      recGPU: data.recGPU,
      features: data.features || []
    }
  });

  await prisma.inventoryLog.create({
    data: {
      type: "NEW_PRODUCT",
      message: `Admin created new product: ${data.name}`
    }
  });

  revalidatePath("/admin/inventory");
  return product;
}

export async function addStock(productId: string, keys: string[]) {
  await checkAdmin();

  const createdKeys = await prisma.inventoryKey.createMany({
    data: keys.map(k => ({
      productId,
      keyValue: k,
      isSold: false
    }))
  });

  await prisma.inventoryLog.create({
    data: {
      type: "NEW_STOCK",
      message: `Added ${keys.length} keys to product ID: ${productId}`
    }
  });

  revalidatePath("/admin/inventory");
  return createdKeys;
}

export async function updateProductPrice(productId: string, newPrice: number) {
  await checkAdmin();

  const product = await prisma.product.update({
    where: { id: productId },
    data: { price: newPrice }
  });

  await prisma.inventoryLog.create({
    data: {
      type: "PRICE_UPDATE",
      message: `Price for ${product.name} updated to $${newPrice}`
    }
  });

  revalidatePath("/admin/inventory");
  return product;
}
