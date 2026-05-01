"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Filter, Eye, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { getOrdersWithPagination } from "@/actions/dashboard";

export default function DashboardOrdersClient({ initialData, initialStatus }: { initialData: any, initialStatus?: string }) {
  const [orders, setOrders] = useState<any[]>(initialData.orders || []);
  const [page, setPage] = useState(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [total, setTotal] = useState(initialData.total || 0);
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");
  const [isLoading, setIsLoading] = useState(false);
  
  const isFirstRender = useRef(true);

  const fetchOrders = useCallback(async (p: number, status: string) => {
    setIsLoading(true);
    try {
      const res = await getOrdersWithPagination(p, 10, status || undefined);
      setOrders(res.orders);
      setTotalPages(res.totalPages);
      setTotal(res.total);
      setPage(res.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchOrders(page, statusFilter);
  }, [page, statusFilter, fetchOrders]);

  const handleExport = () => {
    const exportData = orders.map(order => ({
      "Order ID": `#IVX-${order.id.slice(-6).toUpperCase()}`,
      "Customer Name": order.user.name || "Anonymous",
      "Customer Email": order.user.email,
      "Product": order.productName,
      "Amount": order.amount,
      "Status": order.status,
      "Date": new Date(order.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `Innovix_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <p className="text-gray-500 text-xs">Real-time stream of incoming and processed orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-(--bg-dark) border border-(--bg-dark) text-xs font-bold text-(--text-main) hover:text-(--accent) transition-all cursor-pointer"
          >
            Export CSV
          </button>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="appearance-none flex items-center gap-2 pl-8 pr-8 py-2 rounded-lg bg-(--accent)/10 text-(--accent) text-xs font-bold border border-(--accent)/20 cursor-pointer outline-none focus:border-(--accent)/50 transition-all"
            >
              <option value="">All Views</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Processing">Processing</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--accent) pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] overflow-hidden relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-(--bg-dark)/50 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-(--accent) border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="overflow-x-auto text-[13px]">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-(--bg-less-dark)/30">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-left">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-left">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-left">Product</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="border-b border-(--bg-less-dark)/30 last:border-none group hover:bg-(--bg-less-dark)/20 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-(--accent) font-mono font-bold tracking-tighter hover:underline cursor-pointer">
                      #IVX-{order.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-(--bg-less-dark)/30 flex items-center justify-center border border-(--bg-less-dark)/50 text-[10px] font-bold shrink-0">
                        {order.user?.name ? order.user.name.split(" ").map((n: string) => n[0]).join("") : "U"}
                      </div>
                      <div>
                        <p className="font-bold text-(--text-main)">{order.user?.name || "User"}</p>
                        <p className="text-[10px] text-gray-500">{order.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-(--text-main)">{order.productName}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tight">SKU: {order.id.slice(0, 6).toUpperCase()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-(--text-main)">${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase ${order.status === "Processing" ? "text-(--accent) bg-green-500/10" :
                      order.status === "Fulfilled" ? "text-gray-400 bg-gray-400/10" : "text-red-400 bg-red-400/10"
                      }`}>
                      {order.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-600">
                      <Eye size={18} className="hover:text-(--text-main) cursor-pointer transition-colors" />
                      <Edit3 size={18} className="hover:text-(--accent) cursor-pointer transition-colors" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-600 font-medium">No recent orders detected matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-(--bg-less-dark)/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>Showing {orders.length > 0 ? (page - 1) * 10 + 1 : 0}-{Math.min(page * 10, total)} of {total} entries</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--bg-less-dark)/50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              // Simplified page rendering for now
              let p = page <= 3 ? i + 1 : page - 2 + i;
              if (p > totalPages) return null;
              
              return (
                <button 
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    page === p 
                    ? 'bg-(--accent) text-(--bg-dark) font-bold' 
                    : 'hover:bg-(--bg-less-dark)/50 text-gray-400'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--bg-less-dark)/50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
