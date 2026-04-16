"use server";

import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function verifyOrderFulfillment(params: { sessionId?: string; orderId?: string }) {
  const { sessionId, orderId } = params;

  try {
    let targetOrderId = orderId;

    // If it's a Stripe session, we need to find the order ID from metadata
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        targetOrderId = session.metadata?.orderId;
      }
    }

    if (!targetOrderId) {
      return { success: false, error: "Order ID not found or payment not verified" };
    }

    // Trigger fulfillment (checks internally if already fulfilled)
    const result = await fulfillOrder(targetOrderId);
    
    return result;
  } catch (error) {
    console.error("Verification Action Error:", error);
    return { success: false, error: "Failed to verify payment" };
  }
}
