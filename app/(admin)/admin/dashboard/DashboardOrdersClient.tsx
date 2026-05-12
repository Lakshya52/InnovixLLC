"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Filter, Eye, Edit3, ChevronLeft, ChevronRight, X, Key, ShoppingBag, Send, CheckCircle2, Clock } from "lucide-react";
import * as XLSX from "xlsx";
import { getOrdersWithPagination } from "@/actions/dashboard";
import { manuallyDeliverKey } from "@/actions/admin-orders";
import { toast } from "sonner";

export default function DashboardOrdersClient({ initialData, initialStatus }: { initialData: any, initialStatus?: string }) {
  const [orders, setOrders] = useState<any[]>(initialData.orders || []);
  const [page, setPage] = useState(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [total, setTotal] = useState(initialData.total || 0);
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [manualKeys, setManualKeys] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFirstRender = useRef(true);

  // Initialize manualKeys when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      const items = selectedOrder.items || [
        { productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1, price: selectedOrder.amount }
      ];

      const initialKeys: { [key: string]: string[] } = {};
      items.forEach((item: any) => {
        initialKeys[item.productId] = Array(item.quantity).fill("");
      });
      setManualKeys(initialKeys);
    }
  }, [selectedOrder]);

  const handleKeyChange = (productId: string, index: number, value: string) => {
    setManualKeys(prev => ({
      ...prev,
      [productId]: prev[productId].map((k, i) => i === index ? value : k)
    }));
  };

  const isFormValid = () => {
    if (!selectedOrder) return false;
    return Object.values(manualKeys).every(keys => keys.every(k => k.trim() !== ""));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDeliverKey = async () => {
    if (!selectedOrder) return;

    setIsSubmitting(true);
    try {
      const items = selectedOrder.items || [
        { productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1, price: selectedOrder.amount }
      ];

      const assignments = items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        keys: manualKeys[item.productId] || []
      }));

      const res = await manuallyDeliverKey(selectedOrder.id, assignments);
      if (res.success) {
        toast.success("All keys delivered successfully!");
        setOrders(prev => prev.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'Fulfilled',
              keys: (res.keys || []).map((k: any) => ({
                id: k.id,
                keyValue: k.keyValue,
                status: k.status,
                name: k.name
              }))
            }
            : o
        ));
        setSelectedOrder(null);
      } else {
        toast.error(res.error || "Failed to deliver keys");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      "Date": formatDate(order.createdAt),
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
                    <p className="text-[9px] text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
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
                      {/* {order.status ? === ""} */}
                      {order.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-600">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="hover:text-(--accent) transition-colors cursor-pointer"
                        title="View Details & Deliver Key"
                      >
                        <Eye size={18} />
                      </button>
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
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${page === p
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
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-(--bg-dark) border border-(--bg-less-dark) rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-(--bg-less-dark) flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-grotesk text-(--text-main)">Order <span className="text-(--accent)">Details</span></h3>
                <p className="text-xs text-gray-500 font-mono mt-1">#IVX-{selectedOrder.id.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-(--bg-less-dark) rounded-full transition-all text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8 text-left">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Customer Information</p>
                  <p className="font-bold text-lg text-(--text-main)">{selectedOrder.user?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-400">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Order Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${selectedOrder.status === 'Fulfilled' ? 'text-(--accent) bg-green-500/10' :
                      selectedOrder.status === 'Processing' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                    {selectedOrder.status === "Awaiting_Stock" ? "PENDING_KEY_ASSIGNMENT" : selectedOrder.status}

                  </div>
                </div>
              </div>

              <div className="bg-(--bg-less-dark)/30 p-6 rounded-3xl border border-(--bg-less-dark)/50 text-left">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Items Purchased</p>
                <div className="space-y-4">
                  {(selectedOrder.items || [{ productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1, price: selectedOrder.amount }]).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-(--accent)/10 rounded-xl flex items-center justify-center text-(--accent)">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-(--text-main)">{item.productName}</p>
                          <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="font-bold text-md text-(--text-main)">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-(--bg-less-dark)/50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Amount</p>
                    <p className="text-2xl font-bold text-(--accent)">${selectedOrder.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-left">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Delivery Management</p>

                {selectedOrder.status === 'Fulfilled' && selectedOrder.keys && selectedOrder.keys.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-3xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="text-(--accent)" size={18} />
                          <span className="text-xs font-bold text-green-500 uppercase">Fulfillment Complete</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {selectedOrder.keys.map((k: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                            <Key size={14} className="text-(--accent)" />
                            <span className="text-xs font-mono text-gray-300">{k.keyValue}</span>
                            <span className="ml-auto text-[8px] text-gray-600 font-bold uppercase">{k.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(selectedOrder.items || [{ productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1 }]).map((item: any, itemIdx: number) => (
                      <div key={itemIdx} className="space-y-3 bg-white/5 p-5 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-(--accent)">{item.productName}</p>
                          <span className="text-[10px] bg-(--accent)/10 text-(--accent) px-2 py-0.5 rounded-full font-bold">QTY: {item.quantity}</span>
                        </div>
                        <div className="space-y-3">
                          {Array.from({ length: item.quantity }).map((_, qIdx) => (
                            <div key={qIdx} className="space-y-1.5">
                              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter ml-1">
                                {item.productName} — Key {qIdx + 1} of {item.quantity}
                              </label>
                              <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                <input
                                  type="text"
                                  placeholder="Enter license key..."
                                  value={manualKeys[item.productId]?.[qIdx] || ""}
                                  onChange={(e) => handleKeyChange(item.productId, qIdx, e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-mono outline-none focus:border-(--accent)/40 transition-all text-(--text-main) placeholder:text-gray-700"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleDeliverKey}
                      disabled={!isFormValid() || isSubmitting}
                      className="w-full bg-(--accent) text-(--bg-dark) font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        "Delivering Keys..."
                      ) : (
                        <>
                          <Send size={18} />
                          Deliver All License Keys
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-(--bg-less-dark) bg-(--bg-less-dark)/20 flex items-center justify-between">
              {/* <button 
                onClick={() => setSelectedOrder(null)}
                className="text-sm font-bold text-gray-500 hover:text-(--text-main) transition-all"
              >
                Close
              </button> */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
                <Clock size={12} /> Ordered {formatDate(selectedOrder.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
