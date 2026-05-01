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
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X
} from "lucide-react";
import { logout } from "@/actions/auth";
import { getCurrentUser, updateActivity } from "@/actions/user";
import Navbar from "@/components/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebar, setSidebar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
    
    // Track activity
    updateActivity();
    const interval = setInterval(updateActivity, 1000 * 60 * 5); // Every 5 minutes
    return () => clearInterval(interval);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "My Orders", icon: <ShoppingBag size={20} />, href: "/orders" },
    { name: "Digital Keys", icon: <Key size={20} />, href: "/keys" },
    { name: "Support", icon: <LifeBuoy size={20} />, href: "/support" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
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
      <aside className={`
        bg-(--bg-dark) border-r border-(--bg-dark) flex flex-col p-6 fixed top-0 bottom-0 left-0 z-[70] transition-all duration-300 
        ${mobileMenuOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
        ${sidebar ? "lg:w-1/5" : "lg:w-[85px]"}
      `}>
        <div className={`text-xl font-bold text-(--accent) mb-10 flex items-center ${sidebar || mobileMenuOpen ? 'justify-between gap-2' : 'justify-center'}`}>
          <span className={`${sidebar || mobileMenuOpen ? "block" : "hidden"} transition-all duration-300`} >
            User Dashboard
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebar(prev => !prev)}
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

        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === item.href
                ? "bg-(--accent)/10 text-(--accent)"
                : "text-(--text-main) hover:bg-(--accent)/5 hover:text-(--text-main)"
                } ${sidebar || mobileMenuOpen ? 'justify-start' : 'justify-center px-0'}`}
              title={!sidebar && !mobileMenuOpen ? item.name : ""}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebar || mobileMenuOpen ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-[-12px]"}`}>
                {item.name}
              </span>
            </Link>
          ))}

          {/* Global Links for Mobile Only */}
          <div className="lg:hidden mt-4 pt-4 border-t border-(--bg-less-dark) flex flex-col gap-1">
            <div className="text-[10px] font-bold text-[#666] uppercase tracking-widest px-4 mb-2">Main Site</div>
            {[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: "Live Chat", href: "/chatbot" },
              { name: "About Us", href: "/about" },
              { name: "Blog", href: "/blogs" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-(--accent)/5 hover:text-(--text-main) transition-all text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-(--bg-dark)">
          <form action={logout}>
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-main) hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full text-left cursor-pointer ${sidebar || mobileMenuOpen ? 'justify-start' : 'justify-center px-0'}`}>
              <div className="shrink-0"><LogOut size={20} /></div>
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebar || mobileMenuOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                Logout
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col transition-all duration-300 w-full ${sidebar ? "lg:ml-[20%]" : "lg:ml-[85px]"} ml-0`}>
        {/* Topbar */}
        <div className="sticky top-0 z-40 w-full bg-(--bg-dark) lg:bg-transparent">
          <Navbar isSidebar={true} isLoggedIn={true} user={user} onMenuClick={() => setMobileMenuOpen(true)} />
        </div>

        {/* Page Content */}
        <main className="flex-grow w-full pb-10 pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
