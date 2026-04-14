"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-02-24-preview" as any,
});

export async function createCheckoutSession(items: { productId: string, quantity: number }[]) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) throw new Error("Please log in to purchase.");

  const payload = await decrypt(sessionToken);
  if (!payload) throw new Error("Unauthorized");

  // Fetch product details from DB
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map(i => i.productId) }
    }
  });

  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: product.description || "",
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });

  // Create Stripe session
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    customer_email: payload.email,
    metadata: {
      userId: payload.id,
      items: JSON.stringify(items)
    }
  });

  return { url: stripeSession.url };
}

// Simplified version for PayPal or direct order placement (for demo)
export async function createOrderDirect(items: { productId: string, quantity: number }[]) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) throw new Error("Please log in to purchase.");

  const payload = await decrypt(sessionToken);
  if (!payload) throw new Error("Unauthorized");

  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } }
  });

  const totalAmount = items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  // In production, you would verify payment before this
  const order = await prisma.order.create({
    data: {
      userId: payload.id,
      productName: products.map(p => p.name).join(", "),
      productType: products[0]?.category || "Digital Software",
      amount: totalAmount,
      status: "Fulfilled", // Assuming success for this workflow
    }
  });

  return order;
}
