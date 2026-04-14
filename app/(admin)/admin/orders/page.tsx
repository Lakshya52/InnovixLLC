import React from "react";
import OrdersClient from "./OrdersClient";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect("/login");

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      product: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <OrdersClient initialOrders={JSON.parse(JSON.stringify(orders))} />
  );
}
