"use server";

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    throw new Error("Missing required fields");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Determine Role (Securely auto-elevate the specific admin email)
  const assignedRole = email === "admin@gmail.com" ? "ADMIN" : "USER";

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: assignedRole,
    },
  });

  // Create Session
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

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Missing required fields");
  }

  // Verify User
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify Password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Create Session
  const session = await encrypt({ id: user.id, email: user.email, role: user.role });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
