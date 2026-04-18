import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/user";
import { getAdmins } from "@/actions/admin-settings";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Admin Settings",
  description: "Manage admin settings and preferences",
};

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  const { admins } = await getAdmins();

  return (
    <div className="p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--text-main) mb-2">System Settings</h1>
        <p className="text-gray-400 text-sm">Manage your admin network and global security preferences.</p>
      </div>
      <SettingsClient currentUser={currentUser} initialAdmins={admins || []} />
    </div>
  );
}
