"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    return await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function updateUserImage(image: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { image }
    });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update image error:", error);
    return { error: "Failed to update profile image" };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { name, image }
    });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function updatePreferences(marketing: boolean, transactional: boolean) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { 
        marketingEmails: marketing,
        transactionalEmails: transactional
      }
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Update preferences error:", error);
    return { error: "Failed to update preferences" };
  }
}

export async function requestPasswordOTP() {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        verificationOTP: otp,
        otpExpiry: expiry
      }
    });

    await sendOTPEmail(user.email, otp);
    return { success: true };
  } catch (error) {
    console.error("OTP request error:", error);
    return { error: "Failed to send OTP" };
  }
}

export async function verifyAndChangePassword(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const otp = formData.get("otp") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id }
    });

    if (!user || user.verificationOTP !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return { error: "Invalid or expired OTP" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.id },
      data: {
        password: hashedPassword,
        verificationOTP: null,
        otpExpiry: null
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Failed to update password" };
  }
}
