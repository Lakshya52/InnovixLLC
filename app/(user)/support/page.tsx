import React from "react";
import SupportClient from "./SupportClient";
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

export default async function SupportPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [tickets, totalTickets, resolvedTickets, pendingTickets] = await Promise.all([
    prisma.supportTicket.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.supportTicket.count({ where: { userId: session.id } }),
    prisma.supportTicket.count({ where: { userId: session.id, status: 'RESOLVED' } }),
    prisma.supportTicket.count({ where: { userId: session.id, status: { not: 'RESOLVED' } } })
  ]);

  const stats = [
    { label: "Total Tickets", value: String(totalTickets).padStart(2, '0'), sub: "LIFETIME ACTIVITY", color: "text-(--accent)" },
    { label: "Pending Response", value: String(pendingTickets).padStart(2, '0'), sub: "AWAITING ENGINEER", color: "text-yellow-500" },
    { label: "Resolved", value: String(resolvedTickets).padStart(2, '0'), sub: `SUCCESS RATE ${totalTickets > 0 ? Math.round((resolvedTickets/totalTickets)*100) : 0}%`, color: "text-(--accent)" },
  ];

  return (
    <SupportClient 
      initialTickets={JSON.parse(JSON.stringify(tickets))} 
      stats={stats} 
      userId={session.id}
      userRole={session.role}
    />
  );
}