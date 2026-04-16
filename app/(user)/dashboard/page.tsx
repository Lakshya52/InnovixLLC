import React from "react";
import Link from "next/link";
import {
  Wallet,
  ShieldCheck,
  History,
  ExternalLink,
  Laptop,
  Briefcase,
  Cloud,
  Code2,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Ticket,
  Key
} from "lucide-react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}


export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch real data from database
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      orders: { take: 5, orderBy: { createdAt: 'desc' } },
      keys: { take: 4, orderBy: { id: 'desc' } },
      tickets: { take: 5, orderBy: { updatedAt: 'desc' } }
    }
  });

  if (!user) redirect("/login");

  // Calculate statistics
  const totalAssets = user.orders.reduce((sum, order) => sum + order.amount, 0);
  const activeKeysCount = user.keys.filter(k => k.status === 'Active').length;
  const pendingRenewals = user.keys.filter(k => k.status === 'Expiring').length;

  // Recent activity combine
  const recentActivity = [
    ...user.orders.map(o => ({
      type: 'ORDER',
      title: `Order ${o.id.slice(-4).toUpperCase()} Processed`,
      desc: o.productName,
      time: o.createdAt,
      icon: <CheckCircle2 size={18} />,
      color: "text-(--accent)"
    })),
    ...user.tickets.map(t => ({
      type: 'TICKET',
      title: `Ticket ${t.id.slice(-4).toUpperCase()} ${t.status}`,
      desc: t.subject,
      time: t.updatedAt,
      icon: t.status === 'RESOLVED' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />,
      color: t.status === 'RESOLVED' ? "text-gray-500" : "text-yellow-500/80"
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 4);

  return (
    <div className=" mx-auto w-[90%]">
      {/* Banner */}
      <section className="bg-linear-to-br from-(--bg-dark) to-(--bg-dark) border border-(--bg-dark) rounded-3xl p-12 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-full bg-[radial-gradient(circle_at_center,rgba(110,221,134,0.08)_0%,transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

        <div className="inline-flex items-center gap-2 bg-(--accent)/10 text-(--accent) text-[10px] font-bold uppercase mt-20 tracking-wider px-3 py-1.5 rounded-full mb-6 border border-(--accent)/20">
          <div className="w-1.5 h-1.5 bg-(--accent) rounded-full animate-pulse shadow-[0_0_8px_#6eDD86]"></div>
          System Operational
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          Welcome back, <span className="text-(--accent)">{user.name || 'User'}</span>!
        </h1>
        <p className="text-(--text-main) max-w-lg leading-relaxed text-sm lg:text-base">
          Your digital infrastructure is performing at peak efficiency. You have {pendingRenewals} licenses nearing renewal and {user.keys.length} active deployments.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-2xl p-6 relative transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)/50 group">
          <div className="w-10 h-10 bg-(--bg-dark) rounded-xl flex items-center justify-center mb-4 group-hover:bg-(--accent)/10 transition-colors">
            <div className="text-(--accent)"><Wallet size={20} /></div>
          </div>
          <span className="text-(--text-main) text-[10px] font-bold uppercase tracking-widest block mb-1">Total Digital Assets</span>
          <span className="text-2xl font-bold">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-2xl p-6 relative transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)/50 group">
          <div className="w-10 h-10 bg-(--bg-dark) rounded-xl flex items-center justify-center mb-4 group-hover:bg-(--accent)/10 transition-colors">
            <div className="text-(--accent)"><ShieldCheck size={20} /></div>
          </div>
          <span className="text-(--text-main) text-[10px] font-bold uppercase tracking-widest block mb-1">Active Licenses</span>
          <span className="text-2xl font-bold">{activeKeysCount}</span>
        </div>

        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-2xl p-6 relative transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)/50 group">
          <div className="w-10 h-10 bg-(--bg-dark) rounded-xl flex items-center justify-center mb-4 group-hover:bg-(--accent)/10 transition-colors">
            <div className="text-(--accent)"><History size={20} /></div>
          </div>
          <span className="text-(--text-main) text-[10px] font-bold uppercase tracking-widest block mb-1">Recent Activity</span>
          <span className="text-2xl font-bold">{pendingRenewals} Pending Renewals</span>
          <ExternalLink size={16} className="absolute top-6 right-6 text-gray-600 group-hover:text-(--accent) transition-colors" />
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left Column: Quick Access Keys */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Quick Access Keys</h2>
            <Link href="/keys" className="text-(--accent) text-sm font-medium hover:underline flex items-center gap-1">
              View All Library <ExternalLink size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {user.keys.length > 0 ? user.keys.map((key, i) => (
              <div key={i} className="bg-(--bg-dark) border border-(--bg-dark) rounded-2xl p-6 flex items-start gap-5 hover:border-(--bg-less-dark) transition-all">
                <div className="bg-(--bg-dark) w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-(--bg-less-dark)">
                  <div className="text-gray-400"><Key size={24} /></div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1">{key.name}</h3>
                  <p className="text-(--text-main) text-[10px] mb-4 font-medium uppercase">{key.edition || 'Product Key'}</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-(--accent) text-(--bg-dark) text-[11px] font-bold hover:bg-(--accent) transition-colors cursor-pointer">
                      Copy Key
                    </button>
                    <Link href="/keys" className="px-3 py-1.5 rounded-lg bg-(--bg-dark) border border-(--bg-less-dark) text-(--text-main) text-[11px] font-bold hover:bg-(--bg-less-dark) transition-colors cursor-pointer inline-block">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-12 text-center border-2 border-dashed border-(--bg-dark) rounded-2xl">
                <p className="text-gray-600 mb-4">No license keys found. Visit the store to explore our products.</p>
                <Link href="/products" className="text-(--accent) font-bold hover:underline">Browse Products</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <aside className="bg-(--bg-dark) border border-(--bg-dark) rounded-2xl p-6 flex flex-col hover:border-(--bg-less-dark) transition-all">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

          <div className="flex flex-col gap-6 flex-grow">
            {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-(--bg-dark) flex items-center justify-center shrink-0 border border-(--bg-less-dark) group-hover:scale-110 transition-transform">
                  <div className={activity.color}>{activity.icon}</div>
                </div>
                <div className="flex-grow pt-0.5">
                  <h4 className="text-[13px] font-bold mb-0.5 group-hover:text-(--accent) transition-colors">{activity.title}</h4>
                  <p className="text-(--text-main) text-[11px] mb-1 leading-tight">{activity.desc}</p>
                  <span className="text-gray-600 text-[9px] font-medium tracking-wide">
                    {activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-600 text-sm text-center py-8">No recent activity detected.</p>
            )}
          </div>

          <button className="mt-8 bg-(--bg-dark) border border-(--bg-less-dark) text-(--text-main) py-3 rounded-xl font-bold text-xs hover:bg-[#222] hover:border-(--accent)/30 transition-all cursor-pointer shadow-lg active:scale-[0.98]">
            Download Full Report
          </button>
        </aside>
      </div>

      {/* Dashboard Footer */}
      <footer className="mt-16 pt-8 border-t border-(--bg-dark) flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-(--accent) font-extrabold text-xl tracking-tight">InnovixLLC</span>
          <p className="text-gray-600 text-[10px] font-medium tracking-wide">© 2024 InnovixLLC. High-Performance Precision.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {["Privacy Policy", "Terms of Service", "Licensing", "Support"].map((item) => (
            <Link key={item} href="#" className="text-(--text-main) text-xs font-bold hover:text-(--accent) transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
