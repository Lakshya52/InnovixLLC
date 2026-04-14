"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2
} from "lucide-react";

interface Order {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  productName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 mx-auto w-full max-w-[1400px]">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Customer <span className="text-[#6eDD86]">Orders</span></h1>
          <p className="text-[#a0a0a0] text-sm">Monitor sales performance and manage fulfillment for all digital asset transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#222] transition-all cursor-pointer">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold mb-4">${orders.reduce((acc, o) => acc + o.amount, 0).toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-[#6eDD86] text-xs font-bold font-mono">
            <TrendingUp size={14} /> +8.4% VS LAST WEEK
          </div>
        </div>
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Orders</p>
          <h3 className="text-3xl font-bold mb-4">{orders.filter(o => o.status === 'Processing').length}</h3>
          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold font-mono">
            <Clock size={14} /> REQUIRES ATTENTION
          </div>
        </div>
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Fulfilled Cases</p>
          <h3 className="text-3xl font-bold mb-4">{orders.filter(o => o.status === 'Fulfilled').length}</h3>
          <div className="flex items-center gap-2 text-blue-500 text-xs font-bold font-mono">
            <CheckCircle2 size={14} /> 99.8% SUCCESS RATE
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="Search ID, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl py-2 pl-12 pr-4 text-xs text-white placeholder:text-gray-700 outline-none focus:border-[#6eDD86]/30 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-[#1a1a1a]/30 transition-all">
                  <td className="px-6 py-6">
                    <span className="text-[#6eDD86] font-mono font-bold tracking-tighter">
                      #IVX-{order.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div>
                      <p className="font-bold text-[#e2e2e2]">{order.user.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-600 font-medium">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-[#e2e2e2]">{order.productName}</p>
                  </td>
                  <td className="px-6 py-6 font-bold text-[#e2e2e2]">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase ${order.status === 'Fulfilled' ? 'text-green-500 bg-green-500/10' :
                        order.status === 'Processing' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-400 bg-red-400/10'
                      }`}>
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a] hover:text-white rounded-xl transition-all cursor-pointer">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
