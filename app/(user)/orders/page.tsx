import React from "react";
import OrdersClient from "@/components/orders/OrdersClient";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: {
      keys: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="mx-auto w-[90%] relative">
      <div className="mb-10 px-2">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-grotesk tracking-tight">
          My <span className="text-(--accent)">Orders</span>
        </h1>
        <p className="text-[#666] text-sm font-medium">
          Manage your transaction history, track fulfillment, and download invoices.
        </p>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}