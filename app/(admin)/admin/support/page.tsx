import React from "react";
import SupportClientAdmin from "./SupportClientAdmin";
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

export default async function AdminSupport() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect("/login");

  // Fetch all open tickets to populate the queue
  const tickets = await prisma.supportTicket.findMany({
    where: { 
        status: { not: 'RESOLVED' } 
    },
    include: { 
        user: true,
        messages: {
            take: 1,
            orderBy: { createdAt: 'desc' }
        }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <SupportClientAdmin 
        initialTickets={JSON.parse(JSON.stringify(tickets))} 
        userId={session.id}
        userRole={session.role}
    />
  );
}
