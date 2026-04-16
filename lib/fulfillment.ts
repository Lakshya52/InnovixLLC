import { prisma } from "@/lib/prisma";
import { sendOrderKeyEmail } from "./mail";

export async function fulfillOrder(orderId: string) {
  console.log(`Starting fulfillment for order: ${orderId}`);
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
      return { success: false, error: "Order not found" };
    }

    if (order.status === "Fulfilled") {
      console.log(`Order ${orderId} already fulfilled`);
      const existingKey = await prisma.productKey.findFirst({
        where: { orderId: order.id }
      });
      return { 
        success: true, 
        status: "Fulfilled", 
        productKey: existingKey?.keyValue || null 
      };
    }

    // 1. Find an available key for this product
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
      console.log(`Key found and assigned for order ${orderId}`);
    } else {
      console.warn(`No inventory key available for product ${order.productId} in order ${orderId}`);
    }

    // 3. Update or Create a ProductKey for the user
    // Look for an existing key for this order (in case it was Awaiting_Stock previously)
    const existingProductKey = await prisma.productKey.findFirst({
      where: { orderId: order.id }
    });

    if (existingProductKey) {
      console.log(`Updating existing ProductKey record (ID: ${existingProductKey.id}) for order ${orderId}`);
      await prisma.productKey.update({
        where: { id: existingProductKey.id },
        data: {
          keyValue: assignedKeyValue,
          status: inventoryKey ? "Active" : "Pending_Stock",
          name: order.productName, // Keep name in sync
          iconVariant: order.product?.iconVariant
        }
      });
    } else {
      console.log(`Creating new ProductKey record for order ${orderId}`);
      await prisma.productKey.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          name: order.productName,
          keyValue: assignedKeyValue,
          status: inventoryKey ? "Active" : "Pending_Stock",
          edition: order.product?.category || "Standard",
          iconVariant: order.product?.iconVariant
        }
      });
    }

    // 4. Update order status FIRST to ensure DB is consistent
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: inventoryKey ? "Fulfilled" : "Awaiting_Stock" 
      }
    });

    // 5. Send email if key was available (async, don't block the status update)
    if (inventoryKey) {
      sendOrderKeyEmail(
        order.user.email,
        order.productName,
        inventoryKey.keyValue
      ).catch(emailErr => {
        console.error("Delayed Email Error:", emailErr);
      });
    }

    console.log(`Successfully processed order ${orderId}. Status: ${updatedOrder.status}`);
    return { 
      success: true, 
      status: updatedOrder.status,
      productKey: inventoryKey ? inventoryKey.keyValue : null
    };
  } catch (error) {
    console.error("Critical Fulfillment Error:", error);
    return { success: false, error: "Internal fulfillment error" };
  }
}

/**
 * Processes any orders marked as 'Awaiting_Stock' for a specific product.
 * Called when new inventory keys are added to the system.
 */
export async function processBacklog(productId: string) {
  console.log(`Processing backlog for product: ${productId}`);
  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        productId: productId,
        status: "Awaiting_Stock"
      },
      orderBy: {
        createdAt: "asc" // Fulfill oldest orders first (FIFO)
      }
    });

    if (pendingOrders.length === 0) {
      console.log(`No pending backlog for product ${productId}`);
      return { msg: "No pending orders" };
    }

    console.log(`Found ${pendingOrders.length} pending orders for product ${productId}. Triggering fulfillment...`);
    
    let fulfilledCount = 0;
    for (const order of pendingOrders) {
      const result = await fulfillOrder(order.id);
      if (result.success && result.status === "Fulfilled") {
        fulfilledCount++;
      }
    }

    console.log(`Backlog processing complete. Fulfilled ${fulfilledCount} out of ${pendingOrders.length} orders.`);
    return { fulfilledCount, totalPending: pendingOrders.length };
  } catch (error) {
    console.error("Backlog Processing Error:", error);
    return { error: "Failed to process backlog" };
  }
}
