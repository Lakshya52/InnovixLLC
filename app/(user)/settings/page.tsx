import React from "react";
import { User, Shield, BellRing, Fingerprint, Edit2 } from "lucide-react";
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

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  });

  if (!user) redirect("/login");

  return (
    <div className="p-8 mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Account <span className="text-[#6eDD86]">Settings</span></h1>
        <p className="text-[#a0a0a0] text-sm">Manage your digital identity and security parameters.</p>
      </div>

      <div className="space-y-8 max-w-6xl">
        {/* Profile Information */}
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#1a1a1a]/40 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110"></div>
          <Fingerprint size={80} className="absolute top-10 right-10 text-[#222] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-10 text-[#6eDD86]">
            <User size={20} />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-[#1f1f1f] group-hover:border-[#6eDD86]/30 transition-all">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || user.email}`} alt="profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-[#6eDD86] w-9 h-9 rounded-full flex items-center justify-center border-4 border-[#121212] text-black cursor-pointer hover:bg-[#5dbb72] transition-colors shadow-lg active:scale-90">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow w-full">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">FULL NAME</label>
                <div className="relative">
                  <input type="text" defaultValue={user.name || ''} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none focus:border-[#6eDD86]/50 transition-all" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">EMAIL ADDRESS</label>
                <div className="relative">
                  <input type="email" defaultValue={user.email} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none focus:border-[#6eDD86]/50 transition-all" disabled />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">ORGANIZATION</label>
                <div className="relative">
                  <input type="text" defaultValue="Innovix Global Solutions" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none focus:border-[#6eDD86]/50 transition-all" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">TIMEZONE</label>
                <div className="relative">
                  <input type="text" defaultValue="Pacific Standard Time (UTC-8)" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none focus:border-[#6eDD86]/50 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication */}
          <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10 space-y-8">
            <div className="flex items-center gap-3 text-[#6eDD86]">
              <Shield size={20} />
              <h2 className="text-xl font-bold">Authentication</h2>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 flex items-center justify-between group hover:border-[#6eDD86]/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#121212] rounded-xl flex items-center justify-center text-[#6eDD86] border border-[#1f1f1f]">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#e2e2e2] mb-0.5">Two-Factor Authentication</h4>
                  <p className="text-[10px] text-[#666] font-medium uppercase tracking-tight">SMS and Authenticator App</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-[#6eDD86]/20 rounded-full relative cursor-pointer border border-[#6eDD86]/30">
                <div className="absolute right-1 top-1 w-4 h-4 bg-[#6eDD86] rounded-full shadow-[0_0_10px_rgba(110,221,134,0.5)] transition-all"></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">CURRENT PASSWORD</label>
                <input type="password" placeholder="••••••••••••" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white placeholder:text-[#333]" />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase">NEW PASSWORD</label>
                <input type="password" placeholder="Enter new password" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white placeholder:text-[#333]" />
              </div>
              <button className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#222] transition-colors cursor-pointer active:scale-95">Update Password</button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-10 space-y-10">
            <div className="flex items-center gap-3 text-[#6eDD86]">
              <BellRing size={20} />
              <h2 className="text-xl font-bold">Preferences</h2>
            </div>

            <div className="space-y-8">
              {[
                { label: "Push Notifications", desc: "Real-time alerts for key actions", active: true },
                { label: "Email Summaries", desc: "Weekly performance and usage reports", active: false },
                { label: "Marketing Communication", desc: "New product updates and offers", active: false },
                { label: "Beta Features", desc: "Early access to experimental toolkits", active: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div>
                    <h4 className="text-sm font-bold text-[#e2e2e2] mb-1 group-hover:text-[#6eDD86] transition-colors">{pref.label}</h4>
                    <p className="text-[11px] text-[#666] font-medium leading-tight">{pref.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer border transition-all ${pref.active ? 'bg-[#6eDD86]/20 border-[#6eDD86]/30' : 'bg-[#1a1a1a] border-[#2a2a2a]'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${pref.active ? 'right-1 bg-[#6eDD86] shadow-[0_0_10px_rgba(110,221,134,0.5)]' : 'left-1 bg-[#333]'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6">
          <button className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#222] transition-colors cursor-pointer active:scale-95">Discard Changes</button>
          <button className="bg-[#6eDD86] text-black px-10 py-4 rounded-2xl font-bold text-sm hover:bg-[#5dbb72] transition-all cursor-pointer shadow-[0_0_40px_rgba(110,221,134,0.2)] active:scale-95">Save All Parameters</button>
        </div>
      </div>
    </div>
  );
}