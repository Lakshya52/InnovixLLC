import React from "react";
import {
   Users,
   ShieldAlert,
   MessageCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/actions/dashboard";
import UsersClient from "./UsersClient";

export default async function AdminUsers() {
   const stats = await getDashboardStats();

   // Fetch only non-admin users
   const users = await prisma.user.findMany({
      where: {
         role: {
            not: "ADMIN"
         }
      },
      orderBy: { createdAt: 'desc' }
   });

   // Calculate actual active users (active in the last 15 minutes)
   const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
   const activeUsersCount = await prisma.user.count({
      where: {
         role: { not: "ADMIN" },
         lastActive: {
            gte: fifteenMinutesAgo
         }
      }
   });

   return (
      <div className="p-4 md:p-8 mx-auto w-full">
         <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2 font-grotesk tracking-tight">User <span className="text-(--accent)">Management</span></h1>
            <p className="text-[#666] text-sm font-medium">Monitor user activity, manage permissions, and maintain platform integrity.</p>
         </div>

         {/* Stats Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8 flex items-center justify-between group overflow-hidden relative shadow-sm">
               <div className="absolute top-0 right-0 w-32 h-full bg-(--accent)/5 rounded-full -mr-16 translate-x-4 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
               <div className="relative z-10">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Non-Admin Users</p>
                  <h3 className="text-4xl font-bold mb-2 font-grotesk">{users.length.toLocaleString()}</h3>
               </div>
               <Users size={48} className="text-(--accent)/20 shrink-0 group-hover:text-(--accent)/40 transition-colors duration-500" />
            </div>

            <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8 flex items-center justify-between group overflow-hidden relative shadow-sm">
               <div className="absolute top-0 right-0 w-32 h-full bg-blue-500/5 rounded-full -mr-16 translate-x-4 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
               <div className="relative z-10">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Now</p>
                  <h3 className="text-4xl font-bold mb-2 font-grotesk">{activeUsersCount}</h3>
               </div>
               <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
               </div>
            </div>
         </div>

         {/* Interactive Users List */}
         <UsersClient initialUsers={users} totalUserCount={users.length} />

         {/* Maintenance Section */}
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-12">
            <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-sm">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center text-red-400 border border-red-400/10">
                     <ShieldAlert size={32} />
                  </div>
                  <div>
                     <h4 className="font-bold text-(--text-main) text-lg">Platform Security Compliance</h4>
                     <p className="text-xs text-gray-500 max-w-md">The last automated security audit was completed 2 hours ago. 0 critical vulnerabilities found.</p>
                  </div>
               </div>
               <button className="bg-(--accent) text-(--bg-dark) px-8 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-[0_0_20px_rgba(110,221,134,0.3)]">
                  Refresh Audit
               </button>
            </div>

            <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] p-8 flex items-center gap-5 group shadow-sm">
               <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/10 transition-transform group-hover:rotate-12">
                  <MessageCircle size={28} />
               </div>
               <div>
                  <h4 className="font-bold text-(--text-main) text-lg flex items-center gap-2">8 Support</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Threads</p>
               </div>
            </div>
         </div>
      </div>
   );
}

function Zap({ size, className }: { size: number, className?: string }) {
   return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
   )
}
