import { prisma } from "@/lib/prisma";
import { sendOrderKeyEmail } from "./mail";

export async function fulfillOrder(orderId: string) {
  console.log(`Starting fulfillment for order: ${orderId}`);
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      }
    });

    if (!order) {
      console.error(`Fulfillment Error: Order ${orderId} not found`);
      return { success: false, error: "Order not found" };
    }

    // 1. Get items to fulfill
    const orderItems = ((order as any).items as any[]) || [
      {
        productId: order.productId,
        productName: order.productName,
        quantity: 1
      }
    ];

    let totalFulfilled = 0;
    let totalNeeded = 0;
    let firstAssignedKey = null;

    // Fetch all products in this order to get their metadata
    const productIds = orderItems.map(item => item.productId).filter(Boolean);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    for (const item of orderItems) {
      totalNeeded += item.quantity;
      const product = products.find(p => p.id === item.productId);

      // Check how many keys we already have for this product in this order
      const existingProductKeys = await prisma.productKey.findMany({
        where: {
          orderId: order.id,
          name: item.productName
        }
      });

      // A. Update existing Pending_Stock keys first
      const pendingKeys = existingProductKeys.filter(k => k.status === "Pending_Stock" || k.keyValue === "WAITING_KEY_ASSIGNMENT");
      for (const pk of pendingKeys) {
        const inventoryKey = await prisma.inventoryKey.findFirst({
          where: {
            productId: item.productId,
            isSold: false
          }
        });

        if (inventoryKey) {
          await prisma.inventoryKey.update({
            where: { id: inventoryKey.id },
            data: { isSold: true }
          });

          await prisma.productKey.update({
            where: { id: pk.id },
            data: {
              keyValue: inventoryKey.keyValue,
              status: "Active"
            }
          });

          if (!firstAssignedKey) firstAssignedKey = inventoryKey.keyValue;
          console.log(`Fulfilled pending key ${pk.id} for order ${orderId}`);
        }
      }

      // B. Create new keys if we don't have enough records yet
      const currentRecordCount = existingProductKeys.length;
      const neededNewRecords = item.quantity - currentRecordCount;

      for (let i = 0; i < neededNewRecords; i++) {
        const inventoryKey = await prisma.inventoryKey.findFirst({
          where: {
            productId: item.productId,
            isSold: false
          }
        });

        const assignedKeyValue = inventoryKey ? inventoryKey.keyValue : "NO_KEY_AVAILABLE";

        if (inventoryKey) {
          await prisma.inventoryKey.update({
            where: { id: inventoryKey.id },
            data: { isSold: true }
          });
          if (!firstAssignedKey) firstAssignedKey = assignedKeyValue;
        }

        await prisma.productKey.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            name: item.productName,
            keyValue: assignedKeyValue,
            status: inventoryKey ? "Active" : "Pending_Stock",
            edition: product?.category || "Premium License",
            iconVariant: product?.iconVariant
          }
        });
        console.log(`Created new ProductKey record for order ${orderId} (${item.productName})`);
      }

      // Refresh count after updates/creations
      const finalKeysForProduct = await prisma.productKey.count({
        where: {
          orderId: order.id,
          name: item.productName,
          status: "Active"
        }
      });
      totalFulfilled += finalKeysForProduct;
    }

    // 4. Update order status
    const isFullyFulfilled = totalFulfilled >= totalNeeded;
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: isFullyFulfilled ? "Fulfilled" : "PENDING_KEY_ASSIGNMENT"
      }
    });

    // 5. Send email logic (maybe only if at least one new key was found?)
    // For simplicity, we keep it as is or slightly improve.
    // In a multi-key scenario, maybe we should send all keys or just notification.
    if (firstAssignedKey && order.user.transactionalEmails) {
      sendOrderKeyEmail(
        order.user.email,
        order.productName, // Could be comma separated list
        firstAssignedKey // Just shows the first one in the email for now
      ).catch(console.error);
    }

    console.log(`Order ${orderId} processed. Status: ${updatedOrder.status}. Fulfilled ${totalFulfilled}/${totalNeeded}`);

    return {
      success: true,
      status: updatedOrder.status,
      productKey: firstAssignedKey
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
  console.log(`Processing backlog. Restocked product: ${productId}`);
  try {
    // Find all orders that are still waiting for stock
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING_KEY_ASSIGNMENT"
      },
      orderBy: {
        createdAt: "asc" // Fulfill oldest orders first (FIFO)
      }
    });

    if (pendingOrders.length === 0) {
      console.log(`No pending backlog found.`);
      return { msg: "No pending orders" };
    }

    console.log(`Found ${pendingOrders.length} orders in PENDING_KEY_ASSIGNMENT. Triggering fulfillment check...`);

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
