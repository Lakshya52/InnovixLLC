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

import { getOrdersWithPagination, getDashboardStats } from "@/actions/dashboard";

export default async function AdminOrdersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; status?: string }> 
}) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect("/login");

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const status = resolvedParams.status;

  const data = await getOrdersWithPagination(page, 10, status);
  const stats = await getDashboardStats();

  return (
    <OrdersClient 
      initialData={JSON.parse(JSON.stringify(data))} 
      initialStatus={status}
      totalRevenue={stats.revenue}
    />
  );
}
