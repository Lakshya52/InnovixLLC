"use client";

import React, { useState } from "react";
import { Plus, BarChart3, Clock, CheckCircle2, Search, ChevronRight, Server, RotateCcw, FileText, X, MessageSquare, ChevronDown } from "lucide-react";
import SupportChat from "./SupportChat";
import { getUserTickets } from "@/actions/chat";
import { useEffect } from "react";

interface Ticket {
  id: string;
  status: string;
  title?: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
  assignedAgent?: string;
  category: string;
}

export default function SupportClient({ 
  initialTickets, 
  stats,
  userId,
  userRole 
}: { 
  initialTickets: Ticket[], 
  stats: any[],
  userId: string,
  userRole: string
}) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [showModal, setShowModal] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("Windows 11 Home/Pro");

  // Poll for user ticket updates (status changes)
  useEffect(() => {
    const pollUserTickets = async () => {
      try {
        const fresh = await getUserTickets();
        setTickets(JSON.parse(JSON.stringify(fresh)));
      } catch (e) {
        console.error("User poll failed", e);
      }
    };
    const interval = setInterval(pollUserTickets, 10000); // 10s is enough for status updates
    return () => clearInterval(interval);
  }, []);

  if (activeChatId) {
    const isNew = activeChatId === "NEW";
    const activeTicket = isNew ? null : tickets.find(t => t.id === activeChatId);
    
    return (
      <SupportChat 
        onBack={() => setActiveChatId(null)} 
        ticketId={activeChatId}   
        userId={userId}
        userRole={userRole}
        subject={isNew ? newTicketSubject : activeTicket?.subject}
        category={isNew ? newTicketCategory : activeTicket?.category}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return "bg-yellow-500/10 text-yellow-500";
      case 'OPEN': return "bg-green-500/10 text-green-500";
      case 'RESOLVED': return "bg-gray-500/10 text-gray-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  const getIcon = (category: string) => {
    if (category.includes('API') || category.includes('Server')) return <Server size={18} className="text-gray-400" />;
    if (category.includes('Reset') || category.includes('Access')) return <RotateCcw size={18} className="text-gray-400" />;
    return <FileText size={18} className="text-gray-400" />;
  };

  return (
    <div className="p-8 mx-auto w-full relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Support <span className="text-[#6eDD86]">Tickets</span></h1>
          <p className="text-[#a0a0a0] text-sm">Manage your technical inquiries and track resolution progress with real-time updates.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#6eDD86] text-black px-6 py-4 rounded-full font-bold text-sm hover:bg-[#5dbb72] transition-colors cursor-pointer"
        >
          <Plus size={20} />
          Create New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#121212] border border-[#1f1f1f] rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a1a1a]/50 rounded-full -mr-16 -mt-16 group-hover:bg-[#1a1a1a] transition-colors"></div>
            <span className="text-[#a0a0a0] text-xs font-semibold mb-2 block">{stat.label}</span>
            <span className={`text-6xl font-bold block mb-8 ${stat.label === 'Pending Response' ? 'text-yellow-500' : 'text-[#e2e2e2]'}`}>{stat.value}</span>
            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-widest ${stat.color}`}>
              {stat.sub}
              {stat.label === 'Total Tickets' && <BarChart3 size={14} />}
              {stat.label === 'Pending Response' && <Clock size={14} />}
              {stat.label === 'Resolved' && <CheckCircle2 size={14} />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[#1f1f1f] mb-8 relative">
        <button className="px-6 py-4 text-[#6eDD86] text-sm font-bold border-b-2 border-[#6eDD86]">Active Tickets</button>
        <button className="px-6 py-4 text-[#666] text-sm font-bold hover:text-[#a0a0a0] transition-colors">Archive</button>
        <button className="px-6 py-4 text-[#666] text-sm font-bold hover:text-[#a0a0a0] transition-colors">Feedback Required</button>
        <div className="ml-auto flex items-center gap-2 text-[#666] text-sm">
          Filter by:
          <button className="bg-[#1a1a1a] px-3 py-1 rounded-full text-xs text-[#a0a0a0] flex items-center gap-1 border border-[#2a2a2a]">
            Recently Updated
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tickets.length > 0 ? tickets.map((ticket, i) => (
          <div 
            key={i} 
            onClick={() => setActiveChatId(ticket.id)}
            className="bg-[#121212]/50 border border-[#1f1f1f] rounded-3xl p-8 flex items-center justify-between group hover:bg-[#121212] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#2a2a2a]">
                {getIcon(ticket.category)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[#666] text-xs font-bold tracking-wider font-mono">#{ticket.id.slice(-8).toUpperCase()}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span>
                </div>
                <h3 className="text-xl font-bold text-[#e2e2e2] mb-1">{ticket.subject}</h3>
                <p className="text-[#666] text-xs">
                  Created on {new Date(ticket.createdAt).toLocaleDateString()} • {ticket.status === 'RESOLVED' ? `Resolved: ${new Date(ticket.updatedAt).toLocaleDateString()}` : `Last update: ${new Date(ticket.updatedAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#666] block mb-2 tracking-widest uppercase">{ticket.status === 'RESOLVED' ? 'RESOLUTION' : 'ASSIGNED AGENT'}</span>
                {ticket.status === 'RESOLVED' ? (
                   <div className="flex items-center gap-2 text-green-400 justify-end">
                    <span className="text-sm font-bold">{ticket.resolution || 'Approved'}</span>
                    <CheckCircle2 size={16} />
                   </div>
                ) : (
                  <div className="flex items-center gap-3 justify-end leading-none">
                    <span className="text-sm font-medium text-[#a0a0a0]">{ticket.assignedAgent || 'Queueing...'}</span>
                    {ticket.assignedAgent ? (
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.assignedAgent}`} alt="agent" className="w-8 h-8 rounded-full border border-[#2a2a2a]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
                        <Clock size={14} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <ChevronRight size={20} className="text-[#333] group-hover:text-[#6eDD86] transition-colors" />
            </div>
          </div>
        )) : (
            <div className="py-20 text-center border-2 border-dashed border-[#1f1f1f] rounded-[40px]">
                <p className="text-gray-600 mb-6">No support tickets found. Our technical team is ready to help if you encounter any issues.</p>
                <button 
                    onClick={() => setShowModal(true)}
                    className="text-[#6eDD86] font-bold hover:underline"
                >
                    Create your first ticket
                </button>
            </div>
        )}
      </div>

      {initialTickets.length > 5 && (
        <div className="mt-10 text-center">
            <button className="text-[#666] text-sm font-bold hover:text-[#a0a0a0] transition-colors cursor-pointer">Load More History</button>
        </div>
      )}

      {/* Modal - Simplified for UI, needs Server Action to connect */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] w-full max-w-2xl p-12 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6eDD86]/5 rounded-full blur-[80px] pointer-events-none"></div>

            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-2">New Support <span className="text-[#6eDD86]">Request</span></h2>
            <p className="text-[#a0a0a0] text-sm mb-10">Select your product and click below to connect with a technical expert instantly.</p>

            <form className="space-y-8 relative">
              <div>
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-3">SUBJECT</label>
                <input 
                  type="text" 
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="Briefly describe the issue"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-white placeholder:text-[#333] outline-none focus:border-[#6eDD86]/50 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-3">PRODUCT / CATEGORY</label>
                <div className="relative">
                  <select 
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-4 text-sm text-[#e2e2e2] outline-none focus:border-[#6eDD86]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option>Windows 11 Home/Pro</option>
                    <option>Office 365 Professional</option>
                    <option>Azure Cloud Solutions</option>
                    <option>Enterprise Security</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="button" 
                  disabled={!newTicketSubject.trim()}
                  onClick={() => {
                    setShowModal(false);
                    setActiveChatId("NEW");
                  }}
                  className="w-full bg-[#6eDD86] text-black py-5 rounded-full font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#5dbb72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-[0.98]"
                >
                  <MessageSquare size={18} />
                  Start Support Chat
                </button>
              </div>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-[#666] text-xs font-semibold hover:text-[#a0a0a0] transition-colors cursor-pointer"
                >
                  Cancel and return to tickets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
