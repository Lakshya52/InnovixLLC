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
import { getCurrentUser } from "@/actions/user";
import Navbar from "@/components/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, [pathname]); // Refresh on navigation just in case

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
    <div className="flex min-h-screen w-full bg-(--bg-dark) text-(--text-main) font-inter">
      {/* Sidebar */}
      <aside className={`bg-(--bg-dark) border-r border-(--bg-dark) flex flex-col p-6 fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ${sidebar ? "w-1/5" : "w-[85px]"}`}>
        <div className={`text-xl font-bold text-(--accent) mb-10 flex items-center ${sidebar ? 'justify-between gap-2' : 'justify-center'}`}>
          <span className={`${sidebar ? "block" : "hidden"} transition-all duration-300`} >
            Dashboard
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
                ? "bg-(--accent)/10 text-(--accent)"
                : "text-(--text-main) hover:bg-(--accent)/5 hover:text-(--text-main)"
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
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebar ? "ml-[20%]" : "ml-[85px]"}`}>
        {/* Topbar */}
        <div className="flex sticky top-0 z-40 flex-col w-full">
          <div className="sticky top-0 z-40">
            <Navbar isSidebar={true} isLoggedIn={true} />
          </div>
          <div className="w-full flex items-center justify-center" > 

          <header className="h-[100px] w-[90%] flex items-center justify-between border-b border-(--bg-dark) bg-(--bg-dark)  ">
            <div className="flex items-center bg-(--bg-dark) border border-(--bg-less-dark) rounded-full px-4 py-2 w-[400px] group focus-within:border-(--accent)/50 transition-all w-full mr-10">
              <Search size={18} className="text-gray-500 group-focus-within:text-(--accent) transition-colors" />
              <input
                type="text"
                placeholder="Search licenses, orders, or documentation..."
                className="bg-transparent border-none text-(--text-main) ml-2 w-full outline-none text-sm placeholder:text-gray-600"
              />
            </div>

            <div className="flex items-center gap-5">
              <div className="relative cursor-pointer group">
                <Bell size={20} className="text-(--text-main) group-hover:text-(--accent) transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-(--accent) rounded-full border-2 border-(--bg-dark)"></span>
              </div>
              <HelpCircle size={20} className="text-(--text-main) cursor-pointer hover:text-(--accent) transition-colors" />
              <Link href="/settings" className="w-[35px] h-[35px] rounded-full bg-(--bg-dark) flex items-center justify-center border border-(--bg-less-dark) overflow-hidden cursor-pointer hover:border-(--accent)/50 transition-all">
                {user?.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </Link>
            </div>
          </header>
          </div>

        </div>


        {/* Page Content */}
        <main className="flex-grow overflow-auto w-full pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
