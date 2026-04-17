"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Package, 
  MessageSquare, 
  Settings, 
  BookOpen, 
  LogOut,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { logout } from "@/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebar, setSidebar] = useState(true);

  const navItems = [
    { name: "Orders", icon: <BarChart3 size={20} />, href: "/admin/dashboard" },
    { name: "Users", icon: <Users size={20} />, href: "/admin/users" },
    { name: "Inventory", icon: <Package size={20} />, href: "/admin/inventory" },
    { name: "Support Chats", icon: <MessageSquare size={20} />, href: "/admin/support" },
    { name: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
    { name: "Manage Blogs", icon: <BookOpen size={20} />, href: "/admin/blogs" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-(--bg-less-dark) text-(--text-main) font-inter">
      {/* Sidebar */}
      <aside className={`bg-(--bg-dark) border-r border-(--bg-dark) flex flex-col p-6 fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ${sidebar ? "w-[260px]" : "w-[85px]"}`}>
        <div className={`text-lg font-bold text-(--accent) mb-10 flex items-center ${sidebar ? 'justify-between gap-2' : 'justify-center'}`}>
          <span className={`${sidebar ? "block" : "hidden"} transition-all duration-300 (--text-main)space-nowrap`} >
            Admin Dashboard
          </span>
          <button 
            onClick={() => setSidebar(prev => !prev)}
            className="text-gray-600 cursor-pointer hover:text-(--accent) transition-colors p-1 rounded-md hover:bg-(--text-main)/5"
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
                ? "bg-(--bg-less-dark)/10 text-(--accent)"
                : "text-(--text-main) hover:bg-(--bg-less-dark)/5 hover:text-(--text-main)"
                } ${sidebar ? 'justify-start' : 'justify-center px-0'}`}
              title={!sidebar ? item.name : ""}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className={`font-medium text-sm (--text-main)space-nowrap overflow-hidden transition-all duration-300 ${sidebar ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-[-12px]"}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-(--bg-dark)">
          <form action={logout}>
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-main) hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full text-left cursor-pointer ${sidebar ? 'justify-start' : 'justify-center px-0'}`}>
              <div className="shrink-0"><LogOut size={20} /></div>
              <span className={`font-medium text-sm (--text-main)space-nowrap overflow-hidden transition-all duration-300 ${sidebar ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                Logout
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebar ? "ml-[260px]" : "ml-[85px]"}`}>
        {/* Topbar */}
        <header className="h-[80px] px-8 flex items-center justify-between border-b border-(--bg-dark) bg-(--bg-dark) sticky top-0 z-40">
          <div className="flex items-center bg-(--bg-dark) border border-(--bg-less-dark) rounded-full px-4 py-2 w-[400px] group focus-within:border-(--accent)/50 transition-all w-full mr-10 max-w-[500px]">
            <Search size={18} className="text-gray-500 group-focus-within:text-(--accent) transition-colors" />
            <input
              type="text"
              placeholder="Search orders, customers, or SKUs..."
              className="bg-transparent border-none text-(--text-main) ml-2 w-full outline-none text-sm placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <Bell size={20} className="text-(--text-main) group-hover:text-red-500 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-(--bg-dark)"></span>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-(--text-main)">Full Name</p>
                  <p className="text-[10px] text-gray-500 font-medium">Administrator</p>
               </div>
               <div className="w-[35px] h-[35px] rounded-full bg-(--bg-dark) flex items-center justify-center border border-(--bg-less-dark) overflow-hidden cursor-pointer hover:border-(--accent)/50 transition-all">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="admin" />
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
