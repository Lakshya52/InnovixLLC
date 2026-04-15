const PAYPAL_API = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  
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

export async function createPayPalOrderInternal(amount: number, orderId: string) {
  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
          description: `InnovixLLC Digital Order #${orderId}`,
        },
      ],
      application_context: {
        brand_name: "InnovixLLC",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/paypal/capture?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      },
    }),
  });

  const data = await response.json();
  const approveUrl = data.links.find((link: any) => link.rel === "approve")?.href;
  
  return { id: data.id, url: approveUrl };
}
