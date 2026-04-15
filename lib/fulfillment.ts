import { prisma } from "@/lib/prisma";
import { sendOrderKeyEmail } from "./mail";

export async function fulfillOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        user: true,
        product: true 
      }
    });

    if (!order) {
      console.error(`Fulfillment Error: Order ${orderId} not found`);
      return;
    }

    if (order.status === "Fulfilled") {
      console.log(`Order ${orderId} already fulfilled`);
      return;
    }

    // 1. Find an available key for this product
    // Note: If multiple items in order, we'd loop. 
    // Here we assume 1 product per order as per createCheckoutSession logic
    const inventoryKey = await prisma.inventoryKey.findFirst({
      where: {
        productId: order.productId as string,
        isSold: false
      }
    });

    let assignedKeyValue = "NO_KEY_AVAILABLE";
    
    if (inventoryKey) {
      // 2. Mark inventory key as sold
      await prisma.inventoryKey.update({
        where: { id: inventoryKey.id },
        data: { isSold: true }
      });
      assignedKeyValue = inventoryKey.keyValue;
    }

    // 3. Create a ProductKey for the user
    await prisma.productKey.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        name: order.productName,
        keyValue: assignedKeyValue,
        status: inventoryKey ? "Active" : "Pending_Stock",
        edition: order.product?.category || "Standard",
      }
    });

    // 4. Send email if key was available
    if (inventoryKey) {
      await sendOrderKeyEmail(
        order.user.email,
        order.productName,
        inventoryKey.keyValue
      );
    }

    // 5. Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: inventoryKey ? "Fulfilled" : "Awaiting_Stock" 
      }
    });

    console.log(`Successfully fulfilled order ${orderId}`);
  } catch (error) {
    console.error("Critical Fulfillment Error:", error);
    // In production, you'd want to log this to a monitoring service
  }
}
