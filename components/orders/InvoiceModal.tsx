"use client";

import React from "react";
import { X, Download, Printer } from "lucide-react";
import { downloadInvoice } from "@/lib/invoice-generator";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  user: any;
}

export default function InvoiceModal({ isOpen, onClose, order, user }: InvoiceModalProps) {
  if (!isOpen) return null;

  const orderId = `#IVX-${order.id.slice(-6).toUpperCase()}`;
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-(--bg-dark) border border-(--bg-less-dark) rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--bg-less-dark)">
          <div className="flex items-start justify-center flex-col" >
            <h2 className="text-xl font-bold text-(--text-main)">Order Invoice</h2>
            <p className="text-sm text-[#666]">{orderId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadInvoice(order, user)}
              className="p-2 text-(--text-main) hover:text-(--accent) hover:bg-(--accent)/10 rounded-lg transition-all cursor-pointer"
              title="Download PDF"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-(--text-main) hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col items-start justify-center" >
              <h1 className="text-2xl font-bold text-(--accent) mb-1">INNOVIX LLC</h1>
              <p className="text-xs text-[#666] font-medium tracking-wider">DIGITAL SOLUTIONS & LICENSING</p>
            </div>
            <div className="text-right">
              {/* <p className="text-sm font-bold text-(--text-main)"></p> */}
              <p className="text-sm text-(--text-main)">Bill To : {user.name || "No Name Provided"}</p>
              <p className="text-sm text-[#666]">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 p-4 bg-(--bg-less-dark)/30 rounded-2xl border border-(--bg-less-dark)/50">
            <div className="flex items-start justify-center flex-col" >
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Date</p>
              <p className="text-sm font-bold text-(--text-main)">{date}</p>
            </div>
            <div className="flex items-end justify-center flex-col">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-1">Status</p>
              <p className={`text-sm font-bold ${order.status === 'Fulfilled' ? 'text-green-400' : 'text-yellow-400'}`}>{order.status}</p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-(--bg-less-dark)">
                  <th className="py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Product Description</th>
                  <th className="py-4 text-right text-[10px] font-bold text-[#666] uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-(--bg-less-dark)/50">
                  <td className="py-6">
                    <p className="font-bold text-(--text-main)">{order.productName}</p>
                    <p className="text-xs text-[#666] font-medium">{order.productType}</p>
                  </td>
                  <td className="py-6 text-right font-bold text-(--text-main) text-lg">
                    ${order.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {order.keys && order.keys.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-3">Product Keys</p>
              <div className="space-y-2">
                {order.keys.map((key: any, i: number) => (
                  <div key={i} className="p-3 bg-(--bg-less-dark)/50 border border-(--bg-less-dark) rounded-xl font-mono text-xs text-(--accent) flex justify-between items-center">
                    <span>{key.keyValue}</span>
                    <span className="text-[10px] text-[#666] font-sans font-bold uppercase">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-(--bg-less-dark)">
            <div className="text-right">
              <p className="text-xs text-[#666] font-bold uppercase mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-(--accent)">${order.amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-(--bg-less-dark)/20 text-center border-t border-(--bg-less-dark)">
          <p className="text-xs text-[#666]">For support queries, please contact <span className="text-(--text-main) font-medium">support@innovixllc.com</span></p>
        </div>
      </div>
    </div>
  );
}
