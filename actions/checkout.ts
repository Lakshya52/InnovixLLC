"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/fulfillment";
import { createPayPalOrderInternal } from "@/lib/paypal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia",
});

export async function createCheckoutSession(items: { productId: string, quantity: number }[]) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) throw new Error("Please log in to purchase.");

  const payload = await decrypt(sessionToken);
  if (!payload) throw new Error("Unauthorized");

  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } }
  });

  if (products.length === 0) throw new Error("No products found");

  const totalAmount = items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: payload.id,
      productId: products[0].id,
      productName: products.map(p => p.name).join(", "),
      productType: products[0].category,
      amount: totalAmount,
      status: "Waiting_For_Payment",
    }
  });

  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);

    const productImage = product.image || "";
    const isBase64 = productImage.startsWith("data:");
    const imageUrl = isBase64 
      ? "" // Omit base64 images to avoid URL length errors in Stripe
      : (productImage.startsWith("http") 
        ? productImage 
        : (productImage ? `${process.env.NEXT_PUBLIC_BASE_URL}${productImage}` : ""));

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: (product.description || "").substring(0, 500), // Truncate description for Stripe
          images: imageUrl ? [imageUrl] : [],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    customer_email: payload.email,
    metadata: {
      orderId: order.id,
      userId: payload.id,
    }
  });

  return { url: stripeSession.url };
}

export async function createOrderDirect(items: { productId: string, quantity: number }[]) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) throw new Error("Please log in to purchase.");

  const payload = await decrypt(sessionToken);
  if (!payload) throw new Error("Unauthorized");

  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } }
  });

  if (products.length === 0) throw new Error("No products found");

  const totalAmount = items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: payload.id,
      productId: products[0]?.id,
      productName: products.map(p => p.name).join(", "),
      productType: products[0]?.category || "Digital Software",
      amount: totalAmount,
      status: "Waiting_For_Payment",
    }
  });

  const paypal = await createPayPalOrderInternal(totalAmount, order.id);

  if (!paypal.url) {
    throw new Error("Failed to initialize PayPal payment");
  }

  return { url: paypal.url };
}
