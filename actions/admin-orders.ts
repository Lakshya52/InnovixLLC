"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { sendOrderKeysEmail } from "@/lib/mail";

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");
  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Forbidden");
  return payload;
}

export async function manuallyDeliverKey(orderId: string, assignments: { productId: string, productName: string, keys: string[] }[]) {
  await checkAdmin();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // 1. Fetch existing keys for this order to avoid duplicates
    const existingKeys = await prisma.productKey.findMany({
      where: { orderId: order.id }
    });

    // Fetch product metadata for better consistency
    const productIds = assignments.map(a => a.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    // 2. Process assignments and update existing records or create new ones
    for (const assignment of assignments) {
      const keysToDeliver = assignment.keys.filter(k => k.trim());
      const product = products.find(p => p.id === assignment.productId);
      
      // Filter existing keys that match this product name
      const existingForProduct = existingKeys.filter(k => k.name === assignment.productName);

      for (let i = 0; i < keysToDeliver.length; i++) {
        const keyVal = keysToDeliver[i];

        if (i < existingForProduct.length) {
          // Update existing record (reusing the slot)
          await prisma.productKey.update({
            where: { id: existingForProduct[i].id },
            data: {
              keyValue: keyVal,
              status: "Active",
              iconVariant: product?.iconVariant || existingForProduct[i].iconVariant
            }
          });
          console.log(`Updated existing ProductKey ${existingForProduct[i].id} for order ${orderId}`);
        } else {
          // Create new record only if we don't have enough slots
          await prisma.productKey.create({
            data: {
              userId: order.userId,
              orderId: order.id,
              name: assignment.productName,
              keyValue: keyVal,
              status: "Active",
              edition: product?.category || "Standard",
              iconVariant: product?.iconVariant
            }
          });
          console.log(`Created new ProductKey for order ${orderId} (assignment exceeded existing records)`);
        }
      }
    }

    // 2. Update order status to Fulfilled
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "Fulfilled" }
    });

    // 3. Get the newly created keys to return to the frontend
    const createdKeys = await prisma.productKey.findMany({
      where: { orderId: order.id }
    });

    // 4. Log the action
    await prisma.inventoryLog.create({
      data: {
        type: "MANUAL_FULFILLMENT",
        message: `Admin manually fulfilled order ${orderId} with ${assignments.reduce((acc, a) => acc + a.keys.length, 0)} keys.`
      }
    });

    // 5. Send bundled email to user
    try {
      const emailItems = assignments.map(a => ({
        productName: a.productName,
        keys: a.keys.filter(k => k.trim() !== "")
      }));

      await sendOrderKeysEmail(order.user.email, emailItems);
    } catch (emailErr) {
      console.error("Manual fulfillment email error:", emailErr);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { success: true, keys: createdKeys };
  } catch (error: any) {
    console.error("Manual Fulfillment Error:", error);
    return { success: false, error: error.message || "Failed to deliver keys" };
  }
}
