"use client";

import React from "react";
import { 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronDown 
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-(--bg-dark) text-white pt-32 pb-20 w-full relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-(--accent)/5 rounded-full blur-[120px] -z-10" />

      <div className=" w-[80dvw] mx-auto">
        {/* Header Section */}
        <div className="mb-20">
          <h1 className="text-7xl font-bold font-grotesk tracking-tighter mb-6">
            Connect with <span className="text-(--accent)">Us.</span>
          </h1>
          <p className="text-gray-400 text-xl font-inter max-w-2xl leading-relaxed">
            The hub for high-performance support. Reach our technical team through our verified channels or initiate a secure live session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 h-full bg-white/[0.03] border border-white/5 rounded-[50px] p-12 shadow-2xl">
            {/* <h2 className="text-3xl font-bold font-grotesk mb-10">Direct Transmission</h2> */}
            
            <form className="space-y-8 " onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold font-inter text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-sm font-inter focus:outline-none focus:border-(--accent)/30 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold font-inter text-gray-500 uppercase tracking-widest ml-1">Email ID</label>
                  <input 
                    type="email" 
                    placeholder="name@domain.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-sm font-inter focus:outline-none focus:border-(--accent)/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold font-inter text-gray-500 uppercase tracking-widest ml-1">Technical Inquiry Subject</label>
                <div className="relative">
                  <select className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-sm font-inter appearance-none focus:outline-none focus:border-(--accent)/30 transition-all cursor-pointer text-gray-400">
                    <option value="">Licensing & Authentication</option>
                    <option value="">Enterprise Deployment</option>
                    <option value="">Installation Support</option>
                    <option value="">Billing & Wholesale</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold font-inter text-gray-500 uppercase tracking-widest ml-1">Message Payload</label>
                <textarea 
                  placeholder="How can our engineers assist?"
                  rows={12}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-3xl px-6 py-5 text-sm font-inter focus:outline-none focus:border-(--accent)/30 transition-all resize-none"
                ></textarea>
              </div>

              <button className="button-green w-full flex justify-center" style={{padding:"20px"}}>
                {/* <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-all"> */}
                   Submit Message <Send size={20} />
                {/* </span> */}
              </button>
            </form>
          </div>

          {/* Right Column: Instant Help & Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Live Chat Card */}
            <div className="bg-white/[0.05] border border-white/10 rounded-[50px] p-10 relative overflow-hidden group">
              {/* Background gradient effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-(--accent)/10 blur-[80px] -z-10 group-hover:bg-(--accent)/15 transition-all duration-500" />
              
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold font-grotesk">Need Instant Help?</h2>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-(--accent) animate-pulse shadow-[0_0_8px_var(--accent)]" />
                  <span className="text-[10px] font-bold text-(--accent) uppercase tracking-widest">Live Status</span>
                </div>
              </div>
              
              <p className="text-gray-400 font-inter text-sm leading-relaxed mb-10 max-w-[90%]">
                Bypass the queue. Connect with a verified Innovix technician in under 60 seconds for real-time troubleshooting.
              </p>

              <Link href="/chatbot" className="button-green w-fit">
                Initialize Live Chat <MessageSquare size={20} />
              </Link>
            </div>

            {/* Global Access Points Card */}
            <div className="bg-white/[0.03] border border-white/5 rounded-[50px] p-12 space-y-10">
              <h2 className="text-2xl font-bold font-grotesk mb-4">Global Access Points</h2>
              
              <div className="space-y-10">
                {/* Information Row */}
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-(--accent) font-bold uppercase tracking-[0.2em] mb-1">Global Hotline</p>
                    <p className="text-xl font-bold font-grotesk tracking-tight">+1 (800) 555-TECH</p>
                    <p className="text-[10px] text-gray-500 font-inter mt-1">Available 24/7 for Enterprise Clients</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-(--accent) font-bold uppercase tracking-[0.2em] mb-1">Technical Support</p>
                    <p className="text-xl font-bold font-grotesk tracking-tight">support@innovixllc.com</p>
                    <p className="text-[10px] text-gray-500 font-inter mt-1">Average response: 2 Hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-(--accent) font-bold uppercase tracking-[0.2em] mb-1">Microsoft Partnership</p>
                    <p className="text-xl font-bold font-grotesk tracking-tight">Certified Digital Distributor</p>
                    <p className="text-[10px] text-gray-500 font-inter mt-1">Verification ID: MS-INV-9920-X</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
