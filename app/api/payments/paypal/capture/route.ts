import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";

const PAYPAL_API = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const orderId = searchParams.get("orderId");

  if (!token || !orderId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/cart?error=invalid_paypal_callback`);
  }

  try {
    const accessToken = await getPayPalAccessToken();
    
    // Capture the payment
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "COMPLETED") {
      // Payment successful, trigger fulfillment
      console.log(`PayPal Success: Fulfilling order ${orderId}`);
      await fulfillOrder(orderId);
      
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/success?orderId=${orderId}`);
    } else {
      console.error("PayPal Capture failed:", data);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/cart?error=paypal_capture_failed`);
    }
  } catch (err) {
    console.error("PayPal Callback Error:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/cart?error=internal_server_error`);
  }
}
