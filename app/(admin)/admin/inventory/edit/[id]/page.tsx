import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import EditProductClient from "../EditProductClient";

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return false;
  const payload = await decrypt(session);
  return payload?.role === 'ADMIN';
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isAdmin = await checkAdmin();
  if (!isAdmin) redirect("/login");

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) notFound();

  return (
    <EditProductClient product={JSON.parse(JSON.stringify(product))} />
  );
}
