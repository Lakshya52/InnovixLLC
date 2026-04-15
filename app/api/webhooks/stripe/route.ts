import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/fulfillment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      console.error("Webhook Error: Missing signature or webhook secret");
      return new NextResponse("Webhook Secret Missing", { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const orderId = session.metadata?.orderId;
    
    if (orderId) {
      console.log(`Fulfilling order from Webhook: ${orderId}`);
      await fulfillOrder(orderId);
    }
  }

  return new NextResponse(null, { status: 200 });
}
