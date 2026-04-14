import React from "react";
import AddProductClient from "./AddProductClient";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect("/login");

  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') redirect("/login");

  return <AddProductClient />;
}
