"use client";

import React, { useState } from "react";
import { Plus, BarChart3, Clock, CheckCircle2, Search, ChevronRight, Server, RotateCcw, FileText, X, MessageSquare, ChevronDown, AlertCircle, Circle } from "lucide-react";
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
  stats: initialStats,
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
  const [filter, setFilter] = useState<'Active' | 'Archive' | 'Feedback'>('Active');
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("Windows 11 Home/Pro");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'Recent' | 'Oldest'>('Recent');

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

  const filteredTickets = tickets
    .filter(t => {
      if (filter === 'Active') return t.status !== 'RESOLVED';
      if (filter === 'Archive') return t.status === 'RESOLVED';
      if (filter === 'Feedback') return t.status === 'WAITING_FOR_USER';
      return true;
    })
    .filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'Recent') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });

  if (activeChatId) {
    const isNew = activeChatId === "NEW";
    const activeTicket = isNew ? null : tickets.find(t => t.id === activeChatId);

    return (
      <div className="fixed inset-0 z-[100] bg-(--bg-dark) lg:relative lg:z-0 lg:bg-transparent">
        <SupportChat
          onBack={() => setActiveChatId(null)}
          ticketId={activeChatId}
          userId={userId}
          userRole={userRole}
          subject={isNew ? newTicketSubject : activeTicket?.subject}
          category={isNew ? newTicketCategory : activeTicket?.category}
          initialStatus={activeTicket?.status}
        />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          icon: <Clock size={10} className="animate-pulse" />
        };
      case 'WAITING_FOR_USER':
        return {
          label: 'Feedback Required',
          color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
          icon: <AlertCircle size={10} />
        };
      case 'OPEN':
        return {
          label: 'Open',
          color: "bg-green-500/10 text-(--accent) border-(--accent)/20",
          icon: <Circle size={10} fill="currentColor" />
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
          icon: <CheckCircle2 size={10} />
        };
      default:
        return {
          label: status.replace('_', ' '),
          color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
          icon: <Circle size={10} />
        };
    }
  };

  const getIcon = (category: string) => {
    if (category.includes('API') || category.includes('Server')) return <Server size={18} className="text-gray-400" />;
    if (category.includes('Reset') || category.includes('Access')) return <RotateCcw size={18} className="text-gray-400" />;
    return <FileText size={18} className="text-gray-400" />;
  };

  const dynamicStats = [
    {
      label: "Total Tickets",
      value: String(tickets.length).padStart(2, '0'),
      sub: "LIFETIME ACTIVITY",
      color: "text-(--accent)",
      icon: <BarChart3 size={14} />
    },
    {
      label: "Pending Response",
      value: String(tickets.filter(t => t.status !== 'RESOLVED').length).padStart(2, '0'),
      sub: "AWAITING ENGINEER",
      color: "text-yellow-500",
      icon: <Clock size={14} />
    },
    {
      label: "Resolved",
      value: String(tickets.filter(t => t.status === 'RESOLVED').length).padStart(2, '0'),
      sub: `SUCCESS RATE ${tickets.length > 0 ? Math.round((tickets.filter(t => t.status === 'RESOLVED').length / tickets.length) * 100) : 0}%`,
      color: "text-(--accent)",
      icon: <CheckCircle2 size={14} />
    },
  ];

  return (
    <div className="mx-auto w-[90%] relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 px-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support <span className="text-(--accent)">Tickets</span></h1>
          <p className="text-(--text-main) text-sm max-w-xl">Manage your technical inquiries and track resolution progress with real-time updates.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-(--accent) text-(--bg-dark) px-6 py-4 rounded-full font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-(--accent)/20"
        >
          <Plus size={20} />
          Create New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
        {dynamicStats.map((stat, i) => (
          <div key={i} className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--bg-dark)/50 rounded-full -mr-16 -mt-16 group-hover:bg-(--bg-dark) transition-colors"></div>
            <span className="text-(--text-main) text-xs font-semibold mb-2 block">{stat.label}</span>
            <span className={`text-5xl md:text-6xl font-bold block mb-8 ${stat.label === 'Pending Response' ? 'text-yellow-500' : 'text-(--text-main)'}`}>{stat.value}</span>
            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-widest ${stat.color}`}>
              {stat.sub}
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 mb-8 px-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex border-b border-(--bg-dark) w-full md:w-auto overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setFilter('Active')}
              className={`px-4 md:px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${filter === 'Active' ? 'text-(--accent) border-(--accent)' : 'text-[#666] border-transparent hover:text-(--text-main)'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('Archive')}
              className={`px-4 md:px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${filter === 'Archive' ? 'text-(--accent) border-(--accent)' : 'text-[#666] border-transparent hover:text-(--text-main)'}`}
            >
              Archive
            </button>
            <button
              onClick={() => setFilter('Feedback')}
              className={`px-4 md:px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${filter === 'Feedback' ? 'text-(--accent) border-(--accent)' : 'text-[#666] border-transparent hover:text-(--text-main)'}`}
            >
              Feedback
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#666] text-xs md:text-sm whitespace-nowrap ml-auto">
            Sort:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-(--bg-dark) px-4 py-2 rounded-full text-xs text-(--text-main) border border-(--bg-less-dark) outline-none cursor-pointer hover:border-(--accent)/30 transition-all"
            >
              <option value="Recent">Recent</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="relative w-full">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search by ID or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-(--bg-dark) border border-(--bg-less-dark) rounded-2xl py-4 pl-14 pr-4 text-sm text-(--text-main) placeholder:text-gray-700 outline-none focus:border-(--accent)/30 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4 px-1">
        {filteredTickets.length > 0 ? filteredTickets.map((ticket, i) => (
          <div
            key={i}
            onClick={() => setActiveChatId(ticket.id)}
            className="bg-(--bg-dark)/50 border border-(--bg-dark) rounded-[32px] p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-(--bg-dark) transition-all cursor-pointer relative"
          >
            <div className="flex items-start md:items-center gap-4 md:gap-6">
              <div className="hidden sm:flex w-12 h-12 bg-(--bg-dark) rounded-2xl items-center justify-center border border-(--bg-less-dark) shrink-0">
                {getIcon(ticket.category)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <span className="text-[#666] text-[10px] font-bold tracking-wider font-mono">#{ticket.id.slice(-6).toUpperCase()}</span>
                  {(() => {
                    const badge = getStatusBadge(ticket.status);
                    return (
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1.5 text-[8px] font-bold tracking-wide uppercase border ${badge.color}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-(--text-main) mb-1 truncate">{ticket.subject}</h3>
                <p className="text-[#666] text-[10px] md:text-xs">
                  Updated {new Date(ticket.updatedAt).toLocaleDateString()} • {ticket.category}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-8 border-t border-(--bg-dark) pt-4 md:border-none md:pt-0">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-bold text-[#666] block mb-1 tracking-widest uppercase">{ticket.status === 'RESOLVED' ? 'RESOLUTION' : 'AGENT'}</span>
                {ticket.status === 'RESOLVED' ? (
                  <div className="flex items-center gap-2 text-green-400 md:justify-end">
                    <span className="text-sm font-bold">{ticket.resolution || 'Resolved'}</span>
                    <CheckCircle2 size={14} />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 md:justify-end leading-none">
                    <span className="text-sm font-medium text-(--text-main)">{ticket.assignedAgent || 'Queue'}</span>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.assignedAgent || ticket.id}`} alt="agent" className="w-6 h-6 rounded-full border border-(--bg-less-dark)" />
                  </div>
                )}
              </div>
              <ChevronRight size={20} className="text-[#333] group-hover:text-(--accent) transition-colors" />
            </div>
          </div>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-(--bg-dark) rounded-[40px] px-6">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-700 opacity-20" />
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">No support tickets found in this category. Our technical team is ready to help if you encounter any issues.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-(--accent) font-bold hover:underline"
            >
              Create your first ticket
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-(--bg-dark)/90 backdrop-blur-md p-4">
          <div className="bg-(--bg-dark) border border-(--bg-less-dark) rounded-[40px] w-full max-w-2xl p-6 md:p-12 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-(--accent)/5 rounded-full blur-[80px] pointer-events-none"></div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-(--text-main) transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold mb-2">New Support <span className="text-(--accent)">Request</span></h2>
            <p className="text-(--text-main) text-sm mb-8 md:mb-10">Select your product and click below to connect with a technical expert instantly.</p>

            <form className="space-y-6 md:space-y-8 relative">
              <div>
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-3">SUBJECT</label>
                <input
                  type="text"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="Tell us what heppened"
                  className="w-full bg-(--bg-dark) border border-(--bg-less-dark) rounded-2xl px-6 py-4 text-sm text-(--text-main) placeholder:text-[#333] outline-none focus:border-(--accent)/50 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-3">PRODUCT / CATEGORY</label>
                <div className="relative">
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value)}
                    className="w-full bg-(--bg-dark) border border-(--bg-less-dark) rounded-2xl px-6 py-4 text-sm text-(--text-main) outline-none focus:border-(--accent)/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="operating system" >
                      Operating System
                    </option>
                    <option value="productivity" >
                      Productivity
                    </option>
                    <option value="rds" >
                      RDS
                    </option>
                    <option value="security and privacy" >
                      Security & Privacy
                    </option>
                    <option value="general query" >
                      General Query
                    </option>
                    <option value="payment related" >
                      Payment / Order Related
                    </option>
                    <option value="other" >
                      Other
                    </option>
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
                  className="w-full bg-(--accent) text-(--bg-dark) py-5 rounded-full font-bold text-sm flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-[0_0_30px_rgba(110,221,134,0.2)] active:scale-[0.98]"
                >
                  <MessageSquare size={18} />
                  Start Support Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
