"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function sendMessage(ticketId: string, text: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket) throw new Error("Ticket not found");

  // If admin is sending a message and ticket is OPEN, move it to IN_PROGRESS
  if (payload.role === 'ADMIN' && ticket.status === 'OPEN') {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'IN_PROGRESS' }
    });
  }

  // Create message
  const message = await prisma.chatMessage.create({
    data: {
      ticketId,
      text,
      senderId: payload.id,
      senderRole: payload.role // ADMIN or USER
    }
  });

  // Update ticket last activity
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { updatedAt: new Date() }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return message;
}

export async function createTicket(subject: string, category: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: payload.id,
      subject,
      category,
      status: "OPEN"
    }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return ticket;
}

export async function getMessages(ticketId: string) {
  // Prevent Prisma crash on temporary frontend IDs like "NEW"
  if (!ticketId || ticketId === "NEW") {
    return [];
  }

  return await prisma.chatMessage.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' }
  });
}

export async function getTickets() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Unauthorized");

  return await prisma.supportTicket.findMany({
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
}

export async function getUserTickets() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  return await prisma.supportTicket.findMany({
    where: { 
        userId: payload.id,
        status: { not: 'RESOLVED' } 
    },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function resolveTicket(ticketId: string, resolution?: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Unauthorized");

  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { 
      status: "RESOLVED",
      resolution: resolution || "Resolved by administrator"
    }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");
  return ticket;
}

export async function deleteTicket(ticketId: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Unauthorized");

  // Delete all messages first (though MongoDB/Prisma usually handle this if configured, but let's be explicit)
  await prisma.chatMessage.deleteMany({
    where: { ticketId }
  });

  await prisma.supportTicket.delete({
    where: { id: ticketId }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");
  return { success: true };
}
