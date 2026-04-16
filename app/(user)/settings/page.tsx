import React from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings-form";

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      marketingEmails: true,
      transactionalEmails: true
    }
  });

  if (!user) redirect("/login");

  return (
    <div className=" mx-auto w-[90%]">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Account <span className="text-(--accent)">Settings</span></h1>
        <p className="text-(--text-main) text-sm">Manage your digital identity and security parameters.</p>
      </div>

      <SettingsForm initialUser={user} />
    </div>
  );
}