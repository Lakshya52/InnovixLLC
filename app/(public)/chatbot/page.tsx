"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Settings,
  X,
  Paperclip,
  Camera,
  Send,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAIResponse } from "@/lib/ai-logic";

export default function ChatBot() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: "Sara",
        role: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "Hello! I'm Sara, a chatbot of InnovixLLC. How can I assist you today?",
        avatar: "bot",
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "User",
      role: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: message,
      avatar: "user"
    };

    setMessages(prev => [...prev, userMsg]);
    const currentQuery = message.toLowerCase();
    setMessage("");
    setIsTyping(true);

    // Simulate thinking
    setTimeout(() => {
      setIsTyping(false);

      const botMessages = messages.filter(m => m.role === 'bot');
      const botCount = botMessages.length;

      let responseText = "";
      let showRegister = false;

      if (botCount >= 4) {
        responseText = "Looks like you’ve reached the end of your free support session. To keep chatting and to receive unlimited technical assistance from our support team, please register for an official Innovix account.";
        showRegister = true;
      } else {
        const userHistory = messages.filter(m => m.role === 'user').map(m => m.text);
        const aiResult = getAIResponse(currentQuery, userHistory);
        responseText = aiResult.text;
        showRegister = aiResult.showRegister;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "Sara",
        role: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        showRegister: showRegister,
        avatar: "bot"
      };

      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <div className="h-fit  text-(--text-main)  w-full px-[10dvw] py-5 mt-[15dvh] pb-15 relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full  mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Left Column: Resource Library */}
        <div className="flex flex-col items-start justify-between gap-8 lg:gap-12 mt-10">
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold font-grotesk leading-[0.9] tracking-tighter">
              How can we <span className="text-(--accent)">help</span> <br />
              <span className="text-(--accent)">you</span> today?
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl font-inter max-w-lg leading-relaxed">
              Access our comprehensive resource library or connect directly with our specialized support engineers.
            </p>
          </div>

          <div className="flex w-full gap-6">
            {/* Blogs Card */}
            <Link href="/blogs" className="group w-full relative overflow-hidden bg-(--text-main)/[0.03] border border-(--text-main)/5 rounded-[40px] p-10 hover:bg-(--text-main)/[0.06] transition-all duration-500">
              <div className="flex items-start justify-between">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-(--accent)/10 flex items-center justify-center text-(--accent)">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-grotesk mb-2">Read Our Blogs</h3>
                    <p className="text-gray-400 font-inter text-sm leading-relaxed max-w-sm">
                      Deep dives into product architecture and integration workflows and many more.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-(--text-main)/10 flex items-center justify-center text-gray-500 group-hover:text-(--text-main) group-hover:border-(--text-main)/20 transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Chat Interface */}
        <div className="relative group lg:sticky lg:top-32">
          {/* Glass Card */}
          <div className="bg-(--text-main)/[0.03] border border-(--text-main)/5 rounded-[30px] md:rounded-[40px] overflow-hidden flex flex-col h-[75dvh] lg:h-[80dvh] shadow-2xl shadow-(--bg-dark)/40 mt-8 lg:mt-0">

            {/* Chat Header */}
            <div className="bg-(--text-main)/[0.05] border-b border-(--text-main)/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src="https://api.dicebear.com/9.x/glass/svg?seed=Sara" alt="Sara" className="min-w-14 w-14 min-h-14 h-14 rounded-2xl object-cover bg-(--text-main)/10" />
                  <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-(--accent) border-4 border-(--bg-dark)" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-grotesk">Sara</h3>
                  <p className="text-(--accent) text-xs font-inter uppercase tracking-widest">Technical Lead Engineer</p>
                </div>
              </div>
              {/* <div className="flex items-center sm:gap-3">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all">
                  <Settings size={20} />
                </button>
                <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-(--text-main) hover:bg-(--text-main)/5 transition-all">
                  <X size={20} />
                </Link>
              </div> */}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5  space-y-6 md:space-y-10 custom-scrollbar">
              {/* <div className="flex justify-center">
                <span className="bg-(--text-main)/[0.03] border border-(--text-main)/5 px-6 py-2 rounded-full text-[10px] font-bold text-gray-500 tracking-widest uppercase text-center">
                  ACTIVE SUPPORT SESSION
                </span>
              </div> */}
              

              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-(--accent)/10 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-(--accent)" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-2 md:gap-3 max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-4 rounded-[10px] md:rounded-[20px] font-inter leading-relaxed text-[0.8rem] md:text-[1rem] ${msg.role === 'user'
                      ? 'bg-(--accent) text-(--text-main) shadow-[rgba(110,221,134,0.3)_0px_10px_30px]'
                      : 'bg-(--bg-less-dark) text-(--text-main) border border-(--text-main)/5'
                      }`}>
                      {msg.text}
                      {msg.showRegister && (
                        <div className="mt-4 pt-4 border-t border-(--text-main)/10">
                          <Link href="/registration" className="inline-flex items-center gap-2 bg-(--accent) text-(--bg-dark) px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all">
                            Register Account <ArrowRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className="text-[7px] text-gray-600 font-bold uppercase tracking-widest">{msg.sender} • {msg.time}</span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-(--text-main)/5 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
              

              {isTyping && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-(--text-main)/5 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-inter">Sara is typing...</span>
                </div>
              )}

              
            </div>
            

            {/* Chat Input */}
            <div className="p-5 bg-linear-to-t from-(--text-main)/5 to-transparent border-t border-(--text-main)/5">
              <div className="relative bg-(--text-main)/[0.04] border border-(--text-main)/10 rounded-[20px] md:rounded-[30px] p-1.5 md:p-2 flex items-center gap-2 focus-within:border-(--accent)/30 transition-all">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent px-2 md:px-3 py-1.5 md:py-2 text-sm font-inter outline-none"
                />
                <div className="flex items-center gap-1 pr-1 md:pr-2">
                  <button onClick={handleSend} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-(--accent) text-(--bg-dark) flex items-center justify-center hover:bg-(--accent) transition-all shadow-lg shadow-(--accent)/20 ml-1 md:ml-2">
                    <Send size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
