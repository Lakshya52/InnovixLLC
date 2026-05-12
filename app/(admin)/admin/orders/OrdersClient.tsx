"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  CheckCircle2,
  Key,
  Mail,
  X,
  Send,
  ExternalLink
} from "lucide-react";
import { manuallyDeliverKey } from "@/actions/admin-orders";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Order {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  productName: string;
  productType: string;
  amount: number;
  status: string;
  createdAt: string;
  productId?: string;
  items?: { productId: string, productName: string, quantity: number, price: number }[];
  keys: {
    id: string;
    keyValue: string;
    status: string;
    name: string;
  }[];
}

export default function OrdersClient({
  initialData,
  initialStatus,
  totalRevenue
}: {
  initialData: { orders: Order[], totalPages: number, currentPage: number, total: number },
  initialStatus?: string,
  totalRevenue: string | number
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>(initialData.orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [manualKeys, setManualKeys] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize manualKeys when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      const items = selectedOrder.items || [
        { productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1, price: selectedOrder.amount }
      ];

      const initialKeys: { [key: string]: string[] } = {};
      items.forEach(item => {
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

  const [page, setPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [total, setTotal] = useState(initialData.total);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    setPage(newPage);
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

      const assignments = items.map(item => ({
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

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 mx-auto w-full max-w-[1400px]">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Customer <span className="text-(--accent)">Orders</span></h1>
          <p className="text-(--text-main) text-sm">Monitor sales performance and manage fulfillment for all digital asset transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-(--bg-dark) border border-(--bg-less-dark) text-(--text-main) px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#222] transition-all cursor-pointer">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold mb-4">${Number(totalRevenue).toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-(--accent) text-xs font-bold font-mono text-uppercase">
            AUTO-REVENUE SYNC ACTIVE
          </div>
        </div>
        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Processing Orders</p>
          <h3 className="text-3xl font-bold mb-4">{orders.filter(o => o.status === 'Processing' || o.status === 'Waiting_For_Payment').length}</h3>
          <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold font-mono">
            <Clock size={14} /> PENDING ACTIONS
          </div>
        </div>
        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Success Fulfillment</p>
          <h3 className="text-3xl font-bold mb-4">{orders.filter(o => o.status === 'Fulfilled').length}</h3>
          <div className="flex items-center gap-2 text-blue-500 text-xs font-bold font-mono">
            <CheckCircle2 size={14} /> INSTANT DELIVERY OK
          </div>
        </div>
      </div>

      <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[40px] p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="Search ID, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-(--bg-dark) border border-(--bg-dark) rounded-xl py-2 pl-12 pr-4 text-xs text-(--text-main) placeholder:text-gray-700 outline-none focus:border-(--accent)/30 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-(--bg-dark)">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Delivery Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">License Key</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--bg-dark)">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-(--bg-dark)/30 transition-all">
                  <td className="px-6 py-6 border-transparent border-l-2 group-hover:border-(--accent) transition-all">
                    <span className="text-(--accent) font-mono font-bold tracking-tighter">
                      #IVX-{order.id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-6">
                    <div>
                      <p className="font-bold text-(--text-main)">{order.user.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-600 font-medium">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-(--text-main)">{order.productName}</p>
                    <p className="text-[10px] text-gray-600 mt-1">${order.amount.toFixed(2)} USD</p>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase ${order.status === 'Fulfilled' ? 'text-(--accent) bg-green-500/10' :
                      order.status === 'Processing' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-400 bg-red-400/10'
                      }`}>
                      {order.status === 'Fulfilled' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {order.keys && order.keys.length > 0 ? (
                      <div className="bg-(--bg-dark) border border-[#222] rounded-lg p-2 flex items-center gap-3">
                        <Key size={14} className="text-(--accent)" />
                        <span className="text-[10px] font-mono text-gray-400 select-all">{order.keys[0].keyValue}</span>
                        <div className="ml-auto flex items-center gap-1 text-[8px] text-(--accent)/50 font-bold uppercase tracking-tighter">
                          <Mail size={10} /> Email Sent
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-700 font-bold uppercase italic">No Key Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-(--accent)/10 hover:text-(--accent) text-gray-500 rounded-xl transition-all cursor-pointer flex items-center gap-2 ml-auto text-xs font-bold"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 pt-8 border-t border-(--bg-dark) flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <p className="font-medium">
            Showing <span className="text-(--text-main)">{(page - 1) * 10 + 1}</span> to <span className="text-(--text-main)">{Math.min(page * 10, total)}</span> of <span className="text-(--text-main)">{total}</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-(--bg-dark) border border-transparent hover:border-(--bg-less-dark) transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronLeft size={18} className="group-hover:text-(--accent) transition-colors" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              // Show pages around current page
              if (totalPages > 7 && (p > 1 && p < totalPages && Math.abs(p - page) > 1)) {
                if (p === 2 || p === totalPages - 1) return <span key={p} className="px-2">...</span>;
                return null;
              }

              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer font-bold ${page === p
                      ? 'bg-(--accent) text-(--bg-dark) shadow-[0_0_20px_rgba(110,221,134,0.3)]'
                      : 'hover:bg-(--bg-dark) text-gray-500 hover:text-(--text-main)'
                    }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-(--bg-dark) border border-transparent hover:border-(--bg-less-dark) transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronRight size={18} className="group-hover:text-(--accent) transition-colors" />
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
                <h3 className="text-2xl font-bold font-grotesk">Order <span className="text-(--accent)">Details</span></h3>
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
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Customer Information</p>
                  <p className="font-bold text-lg">{selectedOrder.user.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-400">{selectedOrder.user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Order Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${selectedOrder.status === 'Fulfilled' ? 'text-(--accent) bg-green-500/10' :
                      selectedOrder.status === 'Processing' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                    {selectedOrder.status}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-(--bg-less-dark)/30 p-6 rounded-3xl border border-(--bg-less-dark)/50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Items Purchased</p>
                <div className="space-y-4">
                  {(selectedOrder.items || [{ productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1, price: selectedOrder.amount }]).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-(--accent)/10 rounded-xl flex items-center justify-center text-(--accent)">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.productName}</p>
                          <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="font-bold text-md">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-(--bg-less-dark)/50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Amount</p>
                    <p className="text-2xl font-bold text-(--accent)">${selectedOrder.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* License Key Section */}
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Delivery Management</p>

                {selectedOrder.status === 'Fulfilled' && selectedOrder.keys && selectedOrder.keys.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-3xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="text-(--accent)" size={18} />
                          <span className="text-xs font-bold text-green-500 uppercase">Fulfillment Complete</span>
                        </div>
                        <span className="text-[10px] text-gray-500 italic">Keys sent to {selectedOrder.user.email}</span>
                      </div>
                      <div className="space-y-2">
                        {selectedOrder.keys.map((k, idx) => (
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
                    {(selectedOrder.items || [{ productId: selectedOrder.productId || 'unknown', productName: selectedOrder.productName, quantity: 1 }]).map((item, itemIdx) => (
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

            {/* Modal Footer */}
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
    </div>
  );
}
