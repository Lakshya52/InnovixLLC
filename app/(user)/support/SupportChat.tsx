"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Send,
  Paperclip,
  History,
  UserPlus,
  CheckCircle2,
  Zap,
  ArrowLeft
} from "lucide-react";
import { sendMessage, getMessages, createTicket, resolveTicket, deleteTicket } from "@/actions/chat";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  text: string;
  createdAt: string | Date;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  assignedAgent?: string | null;
}

export default function SupportChat({
  onBack,
  ticketId,
  userId,
  userRole,
  subject = "Support Case Activity",
  category = "Standard Support"
}: {
  onBack: () => void,
  ticketId: string,
  userId: string,
  userRole: string,
  subject?: string,
  category?: string
}) {
  const [currentTicketId, setCurrentTicketId] = useState(ticketId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(ticketId !== "NEW");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update internal ID if prop changes
  useEffect(() => {
    setCurrentTicketId(ticketId);
    if (ticketId === "NEW") {
      setMessages([]);
      setLoading(false);
    }
  }, [ticketId]);


  useEffect(() => {
    if (currentTicketId === "NEW") return;

    const fetchChatData = async () => {
      try {
        const msgs = await getMessages(currentTicketId);
        setMessages(msgs as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
    const interval = setInterval(fetchChatData, 2000);
    return () => clearInterval(interval);
  }, [currentTicketId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");

    try {
      let targetId = currentTicketId;

      // Handle ticket creation if this is a new session
      if (targetId === "NEW") {
        const newTicket = await createTicket(subject, category);
        targetId = newTicket.id;
        setCurrentTicketId(targetId);
      }

      const newMsg = await sendMessage(targetId, text);
      setMessages(prev => [...prev, newMsg as any]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleResolve = async () => {
    if (!currentTicketId || currentTicketId === "NEW") return;
    if (confirm("Are you sure you want to mark this case as resolved?")) {
      try {
        await resolveTicket(currentTicketId);
        onBack();
      } catch (err) {
        console.error("Failed to resolve ticket:", err);
      }
    }
  };

  const handleDelete = async () => {
    if (!currentTicketId || currentTicketId === "NEW") return;
    if (confirm("DANGER: This will permanently delete the ticket and all chat history. Continue?")) {
      try {
        await deleteTicket(currentTicketId);
        onBack();
      } catch (err) {
        console.error("Failed to delete ticket:", err);
      }
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0d0d0d]">
        <div className="w-8 h-8 border-4 border-[#6eDD86] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center ">

      <div className="flex flex-col lg:flex-row h-[calc(100vh-23vh)] w-[90%] bg-[#0d0d0d] animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Chat Area */}
        <div className="flex-grow flex flex-col border-r border-[#1f1f1f]">
          {/* Chat Header */}
          <div className="p-6 border-b border-[#1f1f1f] bg-[#0d0d0d]/50 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={onBack}
                className="p-2 -ml-2 text-gray-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold tracking-wider">
                #TKT-{currentTicketId === "NEW" ? "NEW" : currentTicketId.slice(-6).toUpperCase()}
              </span>
              <span className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">
                {currentTicketId === "NEW" ? "Awaiting first message" : `Created ${new Date(messages[0]?.createdAt || Date.now()).toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold max-w-[70%] truncate">
                {subject}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#6eDD86]/10 text-[#6eDD86] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-[#6eDD86] rounded-full shadow-[0_0_8px_#6eDD86]"></div>
                  Connected
                </div>
                <button className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#1a1a1a] text-[#a0a0a0] text-[10px] font-medium">
                Live session established. Secure end-to-end encryption active.
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-3 max-w-[80%]`}>
                  {msg.senderId !== userId && (
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border border-[#2a2a2a] mb-6 shrink-0"
                    />
                  )}
                  <div>
                    <div className={`p-6 rounded-[32px] text-sm lg:text-base leading-relaxed ${msg.senderId === userId
                      ? 'bg-[#6eDD86] text-black rounded-tr-none'
                      : 'bg-[#1a1a1a] text-[#e2e2e2] rounded-tl-none border border-[#2a2a2a]'
                      }`}>
                      {msg.text}
                    </div>
                    <div className={`mt-2 flex items-center gap-2 text-[10px] font-bold tracking-tight text-[#666] ${msg.senderId === userId ? 'justify-end' : 'justify-start ml-4'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-8 border-t border-[#1f1f1f]"
          >
            <div className="max-w-4xl mx-auto flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-6 py-2 group focus-within:border-[#6eDD86]/30 transition-all">
              <button type="button" className="text-gray-500 hover:text-white cursor-pointer mr-4">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-transparent border-none text-white outline-none py-3 text-sm placeholder:text-[#333]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="ml-4 w-10 h-10 bg-[#6eDD86] rounded-full flex items-center justify-center text-black hover:bg-[#5dbb72] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-[0_0_15px_rgba(110,221,134,0.3)]"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <aside className="w-full lg:w-[320px] p-8 space-y-12 bg-[#0d0d0d] overflow-y-auto hidden lg:block">
          <section>
            <h3 className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-6">Ticket Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500">Status</span>
                <div className="flex items-center gap-2 text-white">
                  Active
                  <div className="w-1.5 h-1.5 bg-[#6eDD86] rounded-full shadow-[0_0_8px_#6eDD86]"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500">Encryption</span>
                <span className="text-[#6eDD86] px-2 py-0.5 rounded bg-[#6eDD86]/10 text-[9px]">E2EE</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500">Connection</span>
                <span className="text-white">Stable</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-6">Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] text-[#a0a0a0] hover:text-white hover:border-[#2a2a2a] transition-all cursor-pointer group">
                <div className="flex items-center gap-3 font-bold text-xs uppercase text-left">
                  <History size={16} /> Incident History
                </div>
              </button>
              {userRole === 'ADMIN' && (
                <>
                  <button
                    onClick={handleResolve}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] text-[#a0a0a0] hover:text-[#6eDD86] hover:border-[#6eDD86]/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 font-bold text-xs uppercase text-left">
                      <CheckCircle2 size={16} /> Resolve Case
                    </div>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 font-bold text-xs uppercase text-left">
                      <Trash2 size={16} /> Delete Ticket
                    </div>
                  </button>
                </>
              )}
              {userRole !== 'ADMIN' && (
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#1f1f1f] text-[#a0a0a0] hover:text-white hover:border-[#2a2a2a] transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 font-bold text-xs uppercase text-left">
                    <UserPlus size={16} /> Request Specialist
                  </div>
                </button>
              )}
            </div>
          </section>

          <section className="p-6 rounded-3xl bg-linear-to-br from-[#121212] to-[#141414] border border-[#1f1f1f] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6eDD86]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center gap-2 text-[#6eDD86] mb-6">
              <Zap size={16} className="fill-[#6eDD86]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Live Metrics</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Avg Response Time</span>
                <span className="text-sm font-bold text-[#6eDD86]">4.2m</span>
              </div>
              <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-[#6eDD86] w-[70%] shadow-[0_0_10px_#6eDD86]"></div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>

  );
}
