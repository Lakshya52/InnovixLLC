import React from "react";
import InventoryClient from "./InventoryClient";
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

export default async function InventoryPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect("/login");

  const [products, logs] = await Promise.all([
    prisma.product.findMany({
      include: {
        stockKeys: {
          where: { isSold: false }
        }
      },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.inventoryLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  return (
    <InventoryClient 
       initialProducts={JSON.parse(JSON.stringify(products))}
       initialLogs={JSON.parse(JSON.stringify(logs))}
    />
  );
}
