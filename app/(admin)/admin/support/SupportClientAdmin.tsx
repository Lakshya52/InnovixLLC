"use client";

import React, { useState, useMemo } from "react";
import SupportChat from "../../../(user)/support/SupportChat";
import { Search, ChevronDown, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { getTickets } from "@/actions/chat";
import { useEffect } from "react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  messages: {
    text: string;
    createdAt: string;
  }[];
}

export default function SupportClientAdmin({
  initialTickets,
  userId,
  userRole
}: {
  initialTickets: Ticket[],
  userId: string,
  userRole: string
}) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'Active' | 'Waiting'>('Active');
  const [searchQuery, setSearchQuery] = useState("");

  // Poll for new/updated tickets every 5 seconds
  useEffect(() => {
    const pollTickets = async () => {
      try {
        const freshTickets = await getTickets();
        setTickets(JSON.parse(JSON.stringify(freshTickets)));
      } catch (err) {
        console.error("Failed to poll tickets:", err);
      }
    };

    const interval = setInterval(pollTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Status filter
      if (filter === 'Active' && ticket.status === 'RESOLVED') return false;
      if (filter === 'Waiting' && ticket.status !== 'OPEN') return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          ticket.user.name?.toLowerCase().includes(query) ||
          ticket.user.email.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [tickets, filter, searchQuery]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-(--bg-dark)">
      {/* Sidebar Queue */}
      <aside className="w-[320px] border-r border-(--bg-dark) flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Live Queues</h2>
          <div className="flex gap-4 border-b border-(--bg-dark) mb-6">
            <button
              onClick={() => setFilter('Active')}
              className={`pb-2 text-sm font-bold transition-all ${filter === 'Active' ? 'text-(--accent) border-b-2 border-(--accent)' : 'text-gray-500 hover:text-(--text-main)'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('Waiting')}
              className={`pb-2 text-sm font-bold transition-all ${filter === 'Waiting' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-(--text-main)'}`}
            >
              Waiting
            </button>
          </div>

          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Filter queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-(--bg-dark) border border-(--bg-less-dark) rounded-xl py-3 pl-12 pr-4 text-xs text-(--text-main) placeholder:text-gray-700 outline-none focus:border-(--accent)/30 transition-all font-medium"
            />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-350px)] scrollbar-hide">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setActiveTicketId(ticket.id)}
                className={`p-4 rounded-[24px] border transition-all cursor-pointer group ${activeTicketId === ticket.id
                    ? 'bg-(--bg-dark) border-(--accent)/50 shadow-[0_0_20px_rgba(110,221,134,0.1)]'
                    : 'bg-(--bg-dark) border-(--bg-dark) hover:border-(--bg-less-dark)'
                  }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.user.email}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-xl border border-(--bg-dark)"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-(--accent) rounded-full border-2 border-(--bg-dark)"></div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-(--text-main) truncate">{ticket.user.name || 'Anonymous'}</p>
                      <span className="text-[9px] text-gray-600 font-bold (--text-main)space-nowrap">
                        {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">{ticket.category}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-1.5 py-0.5 rounded-md bg-(--accent)/10 text-(--accent) text-[8px] font-bold uppercase tracking-wider">AWS</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[8px] font-bold uppercase tracking-wider">API</span>
                </div>

                <p className="text-[10px] text-gray-500 line-clamp-1 italic leading-tight">
                  "{ticket.messages[0]?.text || ticket.subject}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Display */}
      <div className="flex-grow flex flex-col bg-(--bg-dark)">
        {activeTicketId ? (
          <SupportChat
            onBack={() => setActiveTicketId(null)}
            ticketId={activeTicketId}
            userId={userId}
            userRole={userRole}
            subject={activeTicket?.subject}
          />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-12 text-center opacity-30 select-none">
            <MessageSquare size={80} className="mb-6 text-gray-700" />
            <h3 className="text-2xl font-bold mb-2">Queue Monitoring Active</h3>
            <p className="max-w-xs text-sm font-medium">Select a ticket from the live queue on the left to start coordinating with the user.</p>
          </div>
        )}
      </div>
    </div>
  );
}


