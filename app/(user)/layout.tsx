"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Key,
  LifeBuoy,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { logout } from "@/actions/auth";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "My Orders", icon: <ShoppingBag size={20} />, href: "/orders" },
    { name: "Digital Keys", icon: <Key size={20} />, href: "/keys" },
    { name: "Support", icon: <LifeBuoy size={20} />, href: "/support" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
  ];


  // navbar open and close feature.
  const [sidebar, setSidebar] = useState(true)


  return (
    <div className="flex min-h-screen w-full bg-[#0d0d0d] text-[#e2e2e2] font-inter">
      {/* Sidebar */}
      <aside className={`bg-[#121212] border-r border-[#1f1f1f] flex flex-col p-6 fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ${sidebar ? "w-1/5" : "w-[85px]"}`}>
        <div className={`text-xl font-bold text-[#6eDD86] mb-10 flex items-center ${sidebar ? 'justify-between gap-2' : 'justify-center'}`}>
          <span className={`${sidebar ? "block" : "hidden"} transition-all duration-300`} >
            Dashboard
          </span>
          <button 
            onClick={() => setSidebar(prev => !prev)}
            className="text-gray-600 cursor-pointer hover:text-[#6eDD86] transition-colors p-1 rounded-md hover:bg-white/5"
          >
            {sidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-grow overflow-hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === item.href
                ? "bg-[#6eDD86]/10 text-[#6eDD86]"
                : "text-[#a0a0a0] hover:bg-[#6eDD86]/5 hover:text-[#e2e2e2]"
                } ${sidebar ? 'justify-start' : 'justify-center px-0'}`}
              title={!sidebar ? item.name : ""}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebar ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-[-12px]"}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#1f1f1f]">
          <form action={logout}>
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[#a0a0a0] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full text-left cursor-pointer ${sidebar ? 'justify-start' : 'justify-center px-0'}`}>
              <div className="shrink-0"><LogOut size={20} /></div>
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebar ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                Logout
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebar ? "ml-[20%]" : "ml-[85px]"}`}>
        {/* Topbar */}
        <header className="h-[100px] px-8 flex items-center justify-between border-b border-[#1f1f1f] bg-[#0d0d0d] sticky top-0 z-40">
          <div className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 w-[400px] group focus-within:border-[#6eDD86]/50 transition-all w-full mr-10">
            <Search size={18} className="text-gray-500 group-focus-within:text-[#6eDD86] transition-colors" />
            <input
              type="text"
              placeholder="Search licenses, orders, or documentation..."
              className="bg-transparent border-none text-[#e2e2e2] ml-2 w-full outline-none text-sm placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer group">
              <Bell size={20} className="text-[#a0a0a0] group-hover:text-[#6eDD86] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#6eDD86] rounded-full border-2 border-[#0d0d0d]"></span>
            </div>
            <HelpCircle size={20} className="text-[#a0a0a0] cursor-pointer hover:text-[#6eDD86] transition-colors" />
            <div className="w-[35px] h-[35px] rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a] overflow-hidden cursor-pointer hover:border-[#6eDD86]/50 transition-all">
              <User size={20} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
