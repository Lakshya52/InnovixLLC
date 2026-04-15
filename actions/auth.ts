"use server";

import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/mail";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const cpass = formData.get("cpass") as string;
  const name = formData.get("name") as string;
  const terms = formData.get("terms") as string;

  if (!email || !password || !name) {
    return { error: "Missing required fields" };
  }

  if (password !== cpass) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  if (!terms) {
    return { error: "You must accept the terms and conditions" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = email === "admin@gmail.com" ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: assignedRole,
      },
    });

    const session = await encrypt({ id: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, role: user.role };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Missing required fields");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const session = await encrypt({ id: user.id, email: user.email, role: user.role });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return { isLoggedIn: false };
  }

  try {
    const payload = await decrypt(sessionToken);
    return { isLoggedIn: !!payload, user: payload };
  } catch {
    return { isLoggedIn: false };
  }
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });

      await sendResetEmail(email, token);

      console.log(`Email sent to ${email}. Check terminal if ENV not set.`);
    }

    return { success: true };
  } catch (err) {
    console.error("Forgot password error:", err);
    return { error: "Something went wrong" };
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const cpass = formData.get("cpass") as string;

  if (!token || !password || !cpass) {
    return { error: "Missing required fields" };
  }

  if (password !== cpass) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Reset password error:", err);
    return { error: "Something went wrong" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
