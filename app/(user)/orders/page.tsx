import React from "react";
import { Download, FileText, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
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

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className=" mx-auto w-[90%]">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">My <span className="text-[#6eDD86]">Orders</span></h1>
          <p className="text-[#a0a0a0] text-sm">Manage your transaction history and download invoices.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-[#6eDD86] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#5dbb72] transition-colors cursor-pointer">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#222] transition-colors cursor-pointer">
            <Calendar size={16} className="text-[#a0a0a0]" />
            Last 30 Days
            <ChevronRight size={14} className="rotate-90 text-[#a0a0a0]" />
          </button>
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#222] transition-colors cursor-pointer">
            <Filter size={16} className="text-[#a0a0a0]" />
            All Status
            <ChevronRight size={14} className="rotate-90 text-[#a0a0a0]" />
          </button>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#1f1f1f] rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Order-ID</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Product</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Date</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Amount</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order, i) => (
                <tr key={i} className="border-b border-[#1f1f1f] last:border-none group hover:bg-[#1a1a1a]/40 transition-colors">
                  <td className="px-8 py-8 font-bold text-[#6eDD86] text-sm font-mono">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#e2e2e2]">{order.productName}</span>
                      <span className="text-[#666] text-xs font-medium">{order.productType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-[#a0a0a0] font-medium text-sm leading-relaxed whitespace-pre">
                    {order.createdAt.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })},<br />
                    {order.createdAt.getFullYear()}
                  </td>
                  <td className="px-8 py-8 font-bold text-lg text-[#e2e2e2]">${order.amount.toFixed(2)}</td>
                  <td className="px-8 py-8">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-1 tracking-wider ${
                      order.status === 'Fulfilled' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${order.status === 'Fulfilled' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      {order.status}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right px-8">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-[#a0a0a0] hover:text-[#e2e2e2] transition-colors cursor-pointer" title="View Details">
                        <FileText size={20} />
                      </button>
                      <button className="text-[#a0a0a0] hover:text-[#6eDD86] transition-colors cursor-pointer" title="Download Invoice">
                        <Download size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-600 font-medium">
                    No orders found. Once you make a purchase, it will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-[#1f1f1f] flex items-center justify-between">
          <p className="text-[#666] text-xs font-medium">Showing {orders.length} transactions</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-500 cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6eDD86] text-black text-xs font-bold cursor-pointer">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-500 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}