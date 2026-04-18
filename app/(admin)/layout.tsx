import { getCurrentUser } from "@/actions/user";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    // If not logged in as admin, redirect
    redirect("/login");
  }

  return (
    <AdminClientLayout user={user}>
      {children}
    </AdminClientLayout>
  );
}
