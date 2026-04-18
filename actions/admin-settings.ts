"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user";

export async function getAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return { admins };
  } catch (error) {
    console.error("Fetch admins error:", error);
    return { error: "Failed to fetch admins" };
  }
}

export async function updateAdminProfile(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  try {
    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (image !== null) dataToUpdate.image = image || null;
    
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match" };
      }
      if (newPassword.length < 8) {
        return { error: "Password must be at least 8 characters long" };
      }
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Update admin profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function addAdmin(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email is already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        marketingEmails: false,
        transactionalEmails: true,
      },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Add admin error:", error);
    return { error: "Failed to create admin account" };
  }
}
