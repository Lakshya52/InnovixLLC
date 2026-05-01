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

  if (payload.role === 'ADMIN' && ticket.status === 'OPEN') {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'IN_PROGRESS' }
    });
  }

  const message = await prisma.chatMessage.create({
    data: {
      ticketId,
      text,
      senderId: payload.id,
      senderRole: payload.role
    }
  });

  const sender = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, image: true }
  });

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { updatedAt: new Date() }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return { ...message, sender };
}

export async function createTicket(subject: string, category: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: payload.id,
      subject,
      category,
      status: "OPEN",
      messages: {
        create: {
          text: "Hi! How can we help you today? Please describe your issue below.",
          senderId: admin?.id || payload.id,
          senderRole: "ADMIN"
        }
      }
    }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return ticket;
}

export async function getMessages(ticketId: string) {
  if (!ticketId || ticketId === "NEW") return [];

  const messages = await prisma.chatMessage.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' }
  });

  const senderIds = Array.from(new Set(messages.map(m => m.senderId)));
  const senders = await prisma.user.findMany({
    where: { id: { in: senderIds } },
    select: { id: true, name: true, email: true, image: true }
  });

  return messages.map(msg => ({
    ...msg,
    sender: senders.find(s => s.id === msg.senderId)
  }));
}

export async function getTickets() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Unauthorized");

  return await prisma.supportTicket.findMany({
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
    where: { userId: payload.id },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function getTicketDetails(ticketId: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket) throw new Error("Ticket not found");
  if (payload.role !== 'ADMIN' && ticket.userId !== payload.id) {
    throw new Error("Unauthorized");
  }

  return ticket;
}

export async function resolveTicket(ticketId: string, resolution?: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket) throw new Error("Ticket not found");
  if (payload.role !== 'ADMIN' && ticket.userId !== payload.id) {
    throw new Error("Unauthorized");
  }

  const updatedTicket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { 
      status: "WAITING_FOR_USER",
      resolution: resolution || (payload.role === 'ADMIN' ? "Resolved by administrator" : "Resolved by user")
    }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return updatedTicket;
}

export async function submitFeedback(ticketId: string, rating: number, comment: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload) throw new Error("Unauthorized");

  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  const feedbackText = `\n\n[USER FEEDBACK]\nRating: ${rating}/5 stars\nComment: ${comment || 'No comment provided'}`;
  
  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { 
      status: "RESOLVED",
      resolution: (ticket?.resolution || "") + feedbackText
    }
  });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return { success: true };
}

export async function deleteTicket(ticketId: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const payload = await decrypt(session);
  if (!payload || payload.role !== 'ADMIN') throw new Error("Unauthorized");

  await prisma.chatMessage.deleteMany({ where: { ticketId } });
  await prisma.supportTicket.delete({ where: { id: ticketId } });

  revalidatePath("/support");
  revalidatePath("/admin/support");

  return { success: true };
}

export async function sendSystemMessage(ticketId: string, text: string) {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) return null;

  const message = await prisma.chatMessage.create({
    data: {
      ticketId,
      text,
      senderId: admin.id,
      senderRole: 'ADMIN'
    }
  });

  const sender = await prisma.user.findUnique({
    where: { id: admin.id },
    select: { id: true, name: true, email: true, image: true }
  });

  return { ...message, sender };
}
