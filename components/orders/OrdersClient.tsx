"use client";

import React, { useState, useMemo } from "react";
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet
} from "lucide-react";
import * as XLSX from "xlsx";
import OrderActions from "./OrderActions";

interface OrdersClientProps {
  initialOrders: any[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Status options
  const statusOptions = ["All", "Fulfilled", "Waiting_For_Payment", "PENDING_KEY_ASSIGNMENT", "Processing", "Cancelled"];

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return initialOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#IVX-${order.id.slice(-6).toUpperCase()}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, searchTerm, statusFilter]);

  // Sorting logic
  const sortedOrders = useMemo(() => {
    let sortableOrders = [...filteredOrders];
    if (sortConfig !== null) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [filteredOrders, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    const exportData = sortedOrders.map(order => ({
      "Order ID": `#IVX-${order.id.slice(-6).toUpperCase()}`,
      "Product": order.productName,
      "Type": order.productType,
      "Amount": order.amount.toFixed(2),
      "Status": order.status,
      "Date": new Date(order.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `Innovix_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-(--bg-dark) p-6 rounded-3xl border border-(--bg-less-dark)/50">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] group-focus-within:text-(--accent) transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by Order ID or Product name..."
            className="w-full bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-(--accent)/50 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) pl-4 pr-10 py-3 rounded-2xl focus:outline-none focus:border-(--accent)/50 transition-all text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" size={14} />
          </div>

          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-(--accent) text-(--bg-dark) px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-[0_0_20px_rgba(110,221,134,0.2)]"
          >
            <FileSpreadsheet size={18} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-(--bg-less-dark)/50 bg-(--bg-less-dark)/10">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-2">Order-ID <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('productName')}>
                  <div className="flex items-center gap-2">Product <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-2">Amount <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order, i) => (
                <tr key={order.id} className="border-b border-(--bg-less-dark)/30 last:border-none group hover:bg-(--bg-less-dark)/20 transition-colors">
                  <td className="px-8 py-6 font-bold text-(--accent) text-sm font-mono">#IVX-{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-(--text-main) group-hover:text-(--accent) transition-colors">{order.productName}</span>
                      <span className="text-[#666] text-[10px] font-bold uppercase tracking-wider">{order.productType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-(--text-main) font-medium text-sm">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 font-bold text-lg text-(--text-main)">${order.amount.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Fulfilled' ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 
                      order.status === 'Waiting_For_Payment' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' :
                      'text-blue-400 bg-blue-400/10 border border-blue-400/20'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${order.status === 'Fulfilled' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></div>
                      {order.status.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <OrderActions order={order} user={order.user} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-(--bg-less-dark)/30 rounded-full flex items-center justify-center border border-(--bg-less-dark)">
                        <Search className="text-[#666]" size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">No orders found matching your criteria.</p>
                      <button 
                        onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                        className="text-(--accent) text-sm font-bold hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-(--bg-less-dark)/10 border-t border-(--bg-less-dark)/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-xs font-bold uppercase tracking-widest">
            Showing <span className="text-(--text-main)">{paginatedOrders.length}</span> of <span className="text-(--text-main)">{filteredOrders.length}</span> results
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-[10px] font-bold text-[#666] uppercase">Show:</span>
              <select 
                className="bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) text-xs rounded-lg px-2 py-1 outline-none"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[5, 10, 25, 50].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-gray-500 hover:text-(--accent) hover:border-(--accent)/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Simple pagination: show first, last, and current +/- 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          currentPage === page 
                            ? 'bg-(--accent) text-(--bg-dark) shadow-[0_0_15px_rgba(110,221,134,0.3)]' 
                            : 'bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-[#666] hover:text-(--text-main)'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1 text-[#666]">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-gray-500 hover:text-(--accent) hover:border-(--accent)/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
