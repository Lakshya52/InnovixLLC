"use client";

import React, { useState, useEffect } from "react";
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
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/actions/auth";

export default function AdminClientLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();
  const [sidebar, setSidebar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Orders", icon: <BarChart3 size={20} />, href: "/admin/dashboard" },
    { name: "Users", icon: <Users size={20} />, href: "/admin/users" },
    { name: "Inventory", icon: <Package size={20} />, href: "/admin/inventory" },
    { name: "Support Chats", icon: <MessageSquare size={20} />, href: "/admin/support" },
    { name: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
    { name: "Manage Blogs", icon: <BookOpen size={20} />, href: "/admin/blogs" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-(--bg-less-dark) text-(--text-main) font-inter relative">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-(--bg-dark) border-r border-(--bg-dark) flex flex-col p-6 fixed top-0 bottom-0 left-0 z-[70] transition-all duration-300 ${
          mobileMenuOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"
        } ${sidebar ? "lg:w-[260px]" : "lg:w-[85px]"}`}
      >
        <div
          className={`text-lg font-bold text-(--accent) mb-10 flex items-center ${
            sidebar || mobileMenuOpen ? "justify-between gap-2" : "justify-center"
          }`}
        >
          <span
            className={`${
              sidebar || mobileMenuOpen ? "block" : "hidden"
            } transition-all duration-300 whitespace-nowrap`}
          >
            Admin Dashboard
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebar((prev) => !prev)}
              className="hidden lg:block text-gray-600 cursor-pointer hover:text-(--accent) transition-colors p-1 rounded-md hover:bg-(--text-main)/5"
            >
              {sidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-gray-600 cursor-pointer hover:text-(--accent) p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow overflow-hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                pathname === item.href
                  ? "bg-(--accent)/10 text-(--accent)"
                  : "text-gray-500 hover:bg-(--bg-less-dark)/50 hover:text-(--text-main)"
              } ${sidebar || mobileMenuOpen ? "justify-start" : "justify-center px-0"}`}
              title={!sidebar && !mobileMenuOpen ? item.name : ""}
            >
              {/* Active Indicator */}
              {pathname === item.href && (
                <div className="absolute left-0 w-1 h-6 bg-(--accent) rounded-r-full shadow-[0_0_10px_rgba(110,221,134,0.5)]" />
              )}
              
              <div className={`shrink-0 transition-transform duration-300 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110 group-hover:text-(--accent)'}`}>
                {item.icon}
              </div>
              
              <span
                className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  sidebar || mobileMenuOpen ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-[-12px]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-(--bg-less-dark)/10">
          <form action={logout}>
            <button
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full text-left cursor-pointer group ${
                sidebar || mobileMenuOpen ? "justify-start" : "justify-center px-0"
              }`}
            >
              <div className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <LogOut size={20} />
              </div>
              <span
                className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  sidebar || mobileMenuOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                }`}
              >
                Logout
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-grow flex flex-col transition-all duration-300 w-full ${
          sidebar ? "lg:ml-[260px]" : "lg:ml-[85px]"
        } ml-0`}
      >
        {/* Topbar */}
        <header className="h-[80px] px-4 sm:px-8 flex items-center justify-between border-b border-(--bg-dark) bg-(--bg-dark) sticky top-0 z-40">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              className="lg:hidden text-gray-400 hover:text-(--accent) p-1 shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center bg-(--bg-dark) border border-(--bg-less-dark) rounded-full px-4 py-2 w-full md:w-[400px] group focus-within:border-(--accent)/50 transition-all max-w-[500px]">
              <Search
                size={18}
                className="text-gray-500 group-focus-within:text-(--accent) transition-colors shrink-0"
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none text-(--text-main) ml-2 w-full outline-none text-sm placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <Bell size={20} className="text-(--text-main) group-hover:text-red-500 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-(--bg-dark)"></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-(--text-main)">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">Administrator</p>
              </div>
              <div className="w-[35px] h-[35px] rounded-full bg-(--bg-dark) flex items-center justify-center border border-(--bg-less-dark) overflow-hidden cursor-pointer hover:border-(--accent)/50 transition-all">
                <img
                  src={
                    user?.image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "Admin"}`
                  }
                  alt={user?.name || "Admin Avatar"}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
