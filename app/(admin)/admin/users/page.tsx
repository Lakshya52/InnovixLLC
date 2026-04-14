import React from "react";
import { 
  Users, 
  Activity, 
  Filter, 
  Download, 
  Printer, 
  Edit3, 
  Key, 
  Ban, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  MessageCircle,
  Clock,
  History
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="p-8 mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">User <span className="text-[#6eDD86]">Management</span></h1>
        <p className="text-[#a0a0a0] text-sm">Control and monitor your digital ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl">
         <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-full bg-[#1a1a1a]/40 rounded-full -mr-16 translate-x-4 pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Users</p>
               <h3 className="text-4xl font-bold mb-2">12,842</h3>
               <p className="text-[#6eDD86] text-xs font-bold flex items-center gap-1">
                  <Activity size={12} /> +14% from last month
               </p>
            </div>
            <Users size={60} className="text-[#1a1a1a] shrink-0" />
         </div>

         <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-full bg-[#1a1a1a]/40 rounded-full -mr-16 translate-x-4 pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Today</p>
               <h3 className="text-4xl font-bold mb-2">3,109</h3>
               <p className="text-yellow-500 text-xs font-bold flex items-center gap-1">
                  <Zap size={12} className="fill-yellow-500" /> 89% engagement rate
               </p>
            </div>
            <Activity size={60} className="text-[#1a1a1a] shrink-0" />
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#1f1f1f] text-xs font-bold text-[#a0a0a0] hover:text-white transition-all cursor-pointer">
              <Filter size={14} /> Filter: All Roles
           </button>
           <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#1f1f1f] text-xs font-bold text-[#a0a0a0] hover:text-white transition-all cursor-pointer">
              Status: Active
           </button>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
           <Download size={20} className="hover:text-white cursor-pointer transition-colors" />
           <Printer size={20} className="hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Last Activity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#1f1f1f] last:border-none group hover:bg-[#1a1a1a]/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-10 h-10 rounded-xl border border-[#1f1f1f]" alt="avatar" />
                       <div>
                          <p className="font-bold text-[#e2e2e2]">{user.name || 'Anonymous User'}</p>
                          <p className="text-[10px] text-gray-500">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-[#6eDD86]/10 text-[#6eDD86]' : 'bg-gray-500/10 text-gray-500'
                     }`}>
                        {user.role}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6eDD86]"></div>
                        <span className="font-medium text-[#e2e2e2]">Active</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">
                     {Math.floor(Math.random() * 60)} mins ago
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-600">
                       <Edit3 size={18} className="hover:text-white cursor-pointer transition-colors" />
                       <Key size={18} className="hover:text-[#6eDD86] cursor-pointer transition-colors" />
                       <Ban size={18} className="hover:text-red-500 cursor-pointer transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-gray-500 font-medium">
           <p>Showing 1-10 of 12,842 users</p>
           <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer"><ChevronLeft size={14}/></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6eDD86] text-black font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">3</button>
              <span className="px-1 text-[#333]">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">128</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer"><ChevronRight size={14}/></button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
         <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-6 flex items-center justify-between group">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-red-400/10 rounded-full flex items-center justify-center text-red-400">
                  <ShieldAlert size={28} />
               </div>
               <div>
                  <h4 className="font-bold text-[#e2e2e2]">Security Audit Overdue</h4>
                  <p className="text-xs text-gray-500">The last full permission audit was performed 32 days ago.</p>
               </div>
            </div>
            <button className="bg-[#6eDD86] text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#5dbb72] transition-colors cursor-pointer">Start Audit</button>
         </div>

         <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
               <MessageCircle size={24} />
            </div>
            <div>
               <h4 className="font-bold text-[#e2e2e2] flex items-center gap-2">12 New Tickets <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div></h4>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Awaiting response</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function Zap({ size, className }: { size: number, className?: string }) {
    return (
        <svg  width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    )
}
