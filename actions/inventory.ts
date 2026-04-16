"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { processBacklog } from "@/lib/fulfillment";

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");
  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Forbidden");
  return payload;
}

export async function createProduct(data: any) {
  await checkAdmin();

  // Explicitly extract only the fields we want to avoid Prisma validation errors with old fields
  const productData = {
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
    image: data.image,
    systemRequirements: data.systemRequirements,
    features: data.features || []
  };

  const product = await prisma.product.create({
    data: productData
  });

  await prisma.inventoryLog.create({
    data: {
      type: "NEW_PRODUCT",
      message: `Admin created new product: ${data.name}`
    }
  });

  // Handle initial keys if provided
  if (data.initialKeys) {
    const keys = data.initialKeys
      .split("\n")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    if (keys.length > 0) {
      await prisma.inventoryKey.createMany({
        data: keys.map((k: string) => ({
          productId: product.id,
          keyValue: k,
          isSold: false
        }))
      });

      await prisma.inventoryLog.create({
        data: {
          type: "NEW_STOCK",
          message: `Added ${keys.length} initial keys to new product: ${data.name}`
        }
      });
      await processBacklog(product.id);
    }
  }

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

  await processBacklog(productId);

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

export async function updateProduct(id: string, data: any) {
  await checkAdmin();
  
  console.log("ACTUAL updateProduct CALL for ID:", id);

  // Explicitly extract only the fields we want to save
  const updateData = {
    name: data.name,
    category: data.category,
    price: data.price,
    msrp: data.msrp,
    sku: data.sku,
    shortDescription: data.shortDescription,
    description: data.description,
    longDescriptionTwo: data.longDescriptionTwo,
    featureHeading: data.featureHeading,
    status: data.status,
    image: data.image,
    systemRequirements: data.systemRequirements,
    features: data.features || []
  };

  const product = await prisma.product.update({
    where: { id },
    data: updateData
  });

  await prisma.inventoryLog.create({
    data: {
      type: "PRODUCT_UPDATE",
      message: `Admin updated product: ${product.name}`
    }
  });

  // Handle new keys if provided
  if (data.newKeys) {
    const keys = data.newKeys
      .split("\n")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    if (keys.length > 0) {
      await prisma.inventoryKey.createMany({
        data: keys.map((k: string) => ({
          productId: product.id,
          keyValue: k,
          isSold: false
        }))
      });

      await prisma.inventoryLog.create({
        data: {
          type: "NEW_STOCK",
          message: `Added ${keys.length} new keys to product: ${product.name}`
        }
      });
      await processBacklog(id);
    }
  }

  revalidatePath("/admin/inventory");
  revalidatePath(`/products/${id}`);
  return product;
}

export async function deleteProduct(id: string) {
  await checkAdmin();

  const product = await prisma.product.delete({
    where: { id }
  });

  await prisma.inventoryLog.create({
    data: {
      type: "PRODUCT_DELETE",
      message: `Admin deleted product: ${product.name}`
    }
  });

  revalidatePath("/admin/inventory");
  return { success: true };
}
