import React from "react";
import { 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  CircleDot,
  Zap
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="p-8 mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage <span className="text-[#6eDD86]">Orders</span></h1>
          <p className="text-[#a0a0a0] text-sm">Manage digital license keys and product listings for the enterprise software catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#e2e2e2] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#222] transition-all cursor-pointer">
            <Filter size={18} />
            Filters
          </button>
          <button className="flex items-center gap-2 bg-[#6eDD86] text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#5dbb72] transition-all cursor-pointer shadow-[0_0_20px_rgba(110,221,134,0.2)]">
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-[#6eDD86]">
          <div className="flex justify-between items-start mb-6">
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
               <h3 className="text-3xl font-bold">$284,912.40</h3>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-2xl text-gray-400 group-hover:text-[#6eDD86] transition-colors">
               <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-[#6eDD86] text-xs font-bold flex items-center gap-1">
             <TrendingUp size={14} /> +12.4% vs last month
          </p>
        </div>

        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-start mb-6">
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">New Orders</p>
               <h3 className="text-3xl font-bold">1,248</h3>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-2xl text-gray-400 group-hover:text-yellow-500 transition-colors">
               <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-yellow-500 text-xs font-bold flex items-center gap-1">
             <Zap size={14} className="fill-yellow-500" /> 42 in the last hour
          </p>
        </div>

        <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] p-8 relative overflow-hidden group">
          <div className="flex justify-between items-end mb-4">
             <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Fulfillment Rate</p>
                <h3 className="text-3xl font-bold">99.2%</h3>
             </div>
          </div>
          <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-4">
             <div className="h-full bg-[#6eDD86] w-[99.2%] shadow-[0_0_10_rgba(110,221,134,0.3)]"></div>
          </div>
          <p className="text-gray-500 text-[10px] italic font-medium uppercase tracking-tighter">Industry leading performance</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
         <div>
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <p className="text-gray-500 text-xs">Real-time stream of incoming and processed orders.</p>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#1f1f1f] text-xs font-bold text-[#a0a0a0] hover:text-white transition-all cursor-pointer">
               Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6eDD86]/10 text-[#6eDD86] text-xs font-bold border border-[#6eDD86]/20 cursor-pointer">
               <Filter size={14} />
               Filter Views
            </button>
         </div>
      </div>

      <div className="bg-[#121212] border border-[#1f1f1f] rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto text-[13px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="border-b border-[#1f1f1f] last:border-none group hover:bg-[#1a1a1a]/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-[#6eDD86] font-mono font-bold tracking-tighter hover:underline cursor-pointer">
                        #IVX-{order.id.slice(-4).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#1f1f1f] text-[10px] font-bold shrink-0">
                         {order.user.name ? order.user.name.split(' ').map(n=>n[0]).join('') : 'U'}
                      </div>
                      <div>
                         <p className="font-bold text-[#e2e2e2]">{order.user.name || 'User'}</p>
                         <p className="text-[10px] text-gray-500">{order.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                       <p className="font-bold text-[#e2e2e2]">{order.productName}</p>
                       <p className="text-[10px] text-gray-500 uppercase tracking-tight">SKU: {order.id.slice(0, 6).toUpperCase()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-[#e2e2e2]">${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase ${
                      order.status === 'Processing' ? 'text-green-500 bg-green-500/10' : 
                      order.status === 'Fulfilled' ? 'text-gray-400 bg-gray-400/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                      {order.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-600">
                       <Eye size={18} className="hover:text-[#e2e2e2] cursor-pointer transition-colors" />
                       <Edit3 size={18} className="hover:text-[#6eDD86] cursor-pointer transition-colors" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-600 font-medium">No recent orders detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-gray-500">
           <p>Showing 1-10 of {orders.length} entries</p>
           <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">
                 <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6eDD86] text-black font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">
                 <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
