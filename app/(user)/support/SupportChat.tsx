"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Send,
  Paperclip,
  History,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Circle,
  Clock,
  Star,
  ThumbsUp,
  MessageSquare,
  X
} from "lucide-react";
import { sendMessage, getMessages, createTicket, resolveTicket, deleteTicket, sendSystemMessage, submitFeedback, getTicketDetails } from "@/actions/chat";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  text: string;
  createdAt: string | Date;
  sender: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  assignedAgent?: string | null;
  resolution?: string | null;
}

export default function SupportChat({
  onBack,
  ticketId,
  userId,
  userRole,
  subject = "Support Case Activity",
  category = "Standard Support",
  initialStatus
}: {
  onBack: () => void,
  ticketId: string,
  userId: string,
  userRole: string,
  subject?: string,
  category?: string,
  initialStatus?: string
}) {
  const [currentTicketId, setCurrentTicketId] = useState(ticketId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(ticketId !== "NEW");
  const [currentStatus, setCurrentStatus] = useState(initialStatus || "OPEN");
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Feedback State
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Sync internal status state with prop updates
  useEffect(() => {
    if (initialStatus) setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const creationStarted = useRef(false);

  // Update internal ID if prop changes
  useEffect(() => {
    setCurrentTicketId(ticketId);
    if (ticketId === "NEW" && !creationStarted.current) {
      creationStarted.current = true;
      const initTicket = async () => {
        try {
          setLoading(true);
          const newTicket = await createTicket(subject, category);
          setCurrentTicketId(newTicket.id);
        } catch (err) {
          console.error("Failed to auto-create ticket:", err);
          creationStarted.current = false;
        }
      };
      initTicket();
    }
  }, [ticketId, subject, category]);

  useEffect(() => {
    if (currentTicketId === "NEW") return;

    const fetchChatData = async () => {
      try {
        const msgs = await getMessages(currentTicketId);
        setMessages(msgs as any);

        // Fetch latest ticket details for resolution/feedback
        const details = await getTicketDetails(currentTicketId);
        setTicketDetails(details as any);
        // Only update status from server if we are not in the middle of a local state transition
        if (details.status && !isSubmittingFeedback) {
          setCurrentStatus(details.status);
        }
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
  }, [messages, currentStatus]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");

    try {
      let targetId = currentTicketId;
      if (!targetId || targetId === "NEW") return;

      const newMsg = await sendMessage(targetId, text);

      if (messages.length === 1) {
        await sendSystemMessage(targetId, "Your query has been recorded. Our support team will review it and get back to you shortly.");
      }

      const msgs = await getMessages(targetId);
      setMessages(msgs as any);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleResolve = async () => {
    if (!currentTicketId || currentTicketId === "NEW") return;
    if (confirm("Are you sure you want to mark this case as resolved?")) {
      try {
        const updated = await resolveTicket(currentTicketId);
        // Ensure local state is updated immediately to prevent flickering
        setCurrentStatus("WAITING_FOR_USER");
        setTicketDetails(updated as any);
      } catch (err) {
        console.error("Failed to resolve ticket:", err);
      }
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) return;
    setIsSubmittingFeedback(true);
    try {
      await submitFeedback(currentTicketId, rating, feedbackComment);
      setFeedbackSubmitted(true);
      setCurrentStatus("RESOLVED");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

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
      <div className={`flex flex-col mx-auto h-full ${userRole === 'ADMIN' ? 'w-full' : 'w-[90%]'} bg-(--bg-dark) rounded-[32px] overflow-hidden animate-pulse`}>
        <div className="p-6 border-b border-(--bg-dark) bg-(--bg-dark)/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-(--bg-less-dark) rounded-xl"></div>
            <div className="w-24 h-4 bg-(--bg-less-dark) rounded-lg"></div>
            <div className="w-32 h-4 bg-(--bg-less-dark) rounded-lg"></div>
          </div>
          <div className="w-1/2 h-8 bg-(--bg-less-dark) rounded-xl"></div>
        </div>
        <div className="flex-grow p-8 space-y-8 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-3 w-full max-w-[60%]">
                {i % 2 !== 0 && <div className="w-10 h-10 rounded-full bg-(--bg-less-dark) shrink-0"></div>}
                <div className="flex-grow space-y-2">
                  <div className={`h-12 w-full bg-(--bg-less-dark) rounded-[24px] ${i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`}></div>
                  <div className={`h-3 w-12 bg-(--bg-less-dark) rounded-lg ${i % 2 === 0 ? 'ml-auto' : ''}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-(--bg-dark)">
          <div className="max-w-4xl mx-auto h-14 bg-(--bg-less-dark) rounded-full"></div>
        </div>
      </div>
    );
  }

  const isResolved = currentStatus === 'RESOLVED' || currentStatus === 'WAITING_FOR_USER';
  const hasFeedback = ticketDetails?.resolution?.includes('[USER FEEDBACK]');

  return (
    <div className={`flex items-center justify-center w-full h-full ${userRole === 'ADMIN' ? 'p-5' : ''} `}>
      <div className={`flex flex-col lg:flex-row ${userRole === 'ADMIN' ? 'w-full h-full rounded-2xl ' : 'w-[90%]  h-[calc(100vh-23vh)]  rounded-2xl'} bg-(--bg-dark) overflow-hidden`}>
        <div className="flex-grow flex flex-col">
          <div className="p-6 border-b border-(--bg-dark) bg-(--bg-dark)/50 backdrop-blur-md shadow-lg shadow-(--accent) ">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={onBack}
                className="p-2 -ml-2 text-gray-400 hover:text-(--text-main)"
              >
                <ArrowLeft size={20} />
              </button>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-(--accent) text-[10px] font-bold tracking-wider">
                #TKT-{currentTicketId === "NEW" ? "NEW" : currentTicketId.slice(-6).toUpperCase()}
              </span>
              <span className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">
                {currentTicketId === "NEW" ? "Awaiting first message" : `Ticket ID: ${currentTicketId.toUpperCase()}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold max-w-[70%] truncate">
                {subject}
              </h2>
              <div className="flex items-center gap-3">
                {(() => {
                  const badge = getStatusBadge(currentStatus);
                  return (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}>
                      {badge.icon}
                      {badge.label}
                    </div>
                  );
                })()}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${showMenu ? 'bg-(--accent)/10 text-(--accent)' : 'text-gray-500 hover:text-(--text-main) hover:bg-(--bg-less-dark)/50'}`}
                  >
                    {showMenu ? <X size={20} /> : <MoreVertical size={20} />}

                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-3 w-72 bg-(--bg-dark) border border-(--bg-less-dark) rounded-[24px] shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="space-y-8">
                        <section>
                          <h3 className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-4">Case Controls</h3>
                          <div className="space-y-2">
                            {/* <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-(--bg-less-dark)/50 text-(--text-main) transition-all text-xs font-bold uppercase">
                              <History size={16} className="text-gray-500" /> Incident History
                            </button> */}
                            {!isResolved && (
                              <button
                                onClick={() => { handleResolve(); setShowMenu(false); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-(--accent)/10 text-(--text-main) hover:text-(--accent) transition-all text-xs font-bold uppercase"
                              >
                                <CheckCircle2 size={16} /> Mark as Resolved
                              </button>
                            )}
                            {userRole === 'ADMIN' && (
                              <button
                                onClick={() => { handleDelete(); setShowMenu(false); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all text-xs font-bold uppercase"
                              >
                                <Trash2 size={16} /> Delete Ticket
                              </button>
                            )}
                          </div>
                        </section>

                        <section>
                          <h3 className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-4">Ticket Info</h3>
                          <div className="space-y-3 px-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-gray-500">CURRENT STATUS</span>
                              <span className="text-(--accent)">{currentStatus.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-gray-500">CATEGORY</span>
                              <span className="text-(--text-main)">{category.toUpperCase()}</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-(--bg-dark) text-(--text-main) text-[10px] font-medium">
                Live session established. Secure messaging active.
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${msg.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img
                    src={msg.sender?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-(--bg-less-dark) shrink-0 object-cover mt-1"
                  />
                  <div className={`flex flex-col ${msg.senderId === userId ? 'items-end' : 'items-start'}`}>
                    <div className={`p-6 rounded-[32px] text-sm lg:text-base leading-relaxed ${msg.senderId === userId
                      ? 'bg-(--accent) text-(--bg-dark) rounded-tr-none shadow-[0_0_20px_rgba(110,221,134,0.15)]'
                      : 'bg-(--bg-dark) text-(--text-main) rounded-tl-none border border-(--bg-less-dark)'
                      }`}>
                      {msg.text}
                    </div>
                    <div className={`mt-2 flex items-center gap-2 text-[10px] font-bold tracking-tight text-[#666] ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.senderRole === 'ADMIN' && (
                        <>
                          <span className="opacity-30">|</span>
                          <span className={msg.text.includes("recorded") || msg.text.includes("help you today") ? "text-gray-500/80" : "text-(--accent)"}>
                            {msg.text.includes("recorded") || msg.text.includes("help you today") ? "System Generated" : (msg.sender?.name || "Support Team")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isResolved && (
              <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-(--accent)/20 rounded-[40px] bg-(--accent)/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-(--accent)/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} className="text-(--accent)" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ticket Resolved</h3>
                <p className="text-gray-500 text-center text-sm max-w-md mb-8">
                  {currentStatus === 'WAITING_FOR_USER'
                    ? "This case has been marked as resolved by the agent and is currently awaiting user feedback."
                    : "This case has been successfully resolved and closed."}
                </p>

                {currentStatus === 'WAITING_FOR_USER' && userRole !== 'ADMIN' && !feedbackSubmitted ? (
                  <div className="w-full max-w-lg space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-[10px] font-bold text-[#666] tracking-widest uppercase">RATE YOUR EXPERIENCE</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setRating(s)}
                            className={`p-2 transition-all ${rating >= s ? 'text-yellow-500 scale-110' : 'text-gray-600 hover:text-gray-400'}`}
                          >
                            <Star size={32} fill={rating >= s ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Optional: Tell us more about your experience..."
                      className="w-full bg-(--bg-dark) border border-(--bg-less-dark) rounded-2xl p-4 text-sm text-(--text-main) outline-none focus:border-(--accent)/30 transition-all h-24 resize-none"
                    />
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0 || isSubmittingFeedback}
                      className="w-full bg-(--accent) text-(--bg-dark) py-4 rounded-full font-bold text-sm hover:bg-(--accent) transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(110,221,134,0.2)]"
                    >
                      {isSubmittingFeedback ? "Submitting..." : "Submit Feedback & Close Ticket"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 w-full">
                    {hasFeedback && userRole === 'ADMIN' ? (
                      <div className="w-full max-w-lg bg-(--bg-dark) border border-(--bg-less-dark) rounded-3xl p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-(--bg-less-dark) pb-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Star size={14} className="text-yellow-500" />
                            User Feedback Received
                          </h4>
                          <span className="text-(--accent) text-[10px] font-bold bg-(--accent)/10 px-2 py-1 rounded">CLOSED</span>
                        </div>
                        <div className="space-y-4">
                          {(() => {
                            const feedback = ticketDetails?.resolution || "";
                            const ratingMatch = feedback.match(/Rating: (\d)\/5 stars/);
                            const commentMatch = feedback.match(/Comment: (.*)/s);
                            const ratingVal = ratingMatch ? parseInt(ratingMatch[1]) : 0;
                            const commentVal = commentMatch ? commentMatch[1].trim() : 'No comment';

                            return (
                              <>
                                <div className="flex gap-1 text-yellow-500">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={20} fill={s <= ratingVal ? "currentColor" : "none"} />
                                  ))}
                                </div>
                                <p className="text-sm text-(--text-main) italic bg-(--bg-less-dark)/30 p-4 rounded-xl border border-(--bg-less-dark)">
                                  "{commentVal}"
                                </p>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-(--accent) font-bold bg-(--accent)/10 px-6 py-3 rounded-full">
                        <ThumbsUp size={18} />
                        {userRole === 'ADMIN' ? "Resolution Confirmed" : "Thank you for your feedback!"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {!isResolved && (
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-8 border-t border-(--bg-dark)"
            >
              <div className="max-w-4xl mx-auto flex items-center bg-(--bg-dark) border border-(--bg-less-dark) rounded-full px-6 py-2 group focus-within:border-(--accent)/30 transition-all">
                <button type="button" className="text-gray-500 hover:text-(--text-main) cursor-pointer mr-4">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-transparent border-none text-(--text-main) outline-none py-3 text-sm placeholder:text-[#333]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="ml-4 w-10 h-10 bg-(--accent) rounded-full flex items-center justify-center text-(--bg-dark) hover:bg-(--accent) disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-[0_0_15px_rgba(110,221,134,0.3)]"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
