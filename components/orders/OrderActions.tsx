"use client";

import React, { useState } from "react";
import { Eye, Download } from "lucide-react";
import { downloadInvoice } from "@/lib/invoice-generator";
import InvoiceModal from "./InvoiceModal";

interface OrderActionsProps {
  order: any;
  user: any;
}

export default function OrderActions({ order, user }: OrderActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadInvoice(order, user);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  if (order.status === "Waiting_For_Payment") {
    return (
      <div className="flex items-center text-[10px] justify-center font-bold uppercase text-yellow-500/50 bg-yellow-500/5 rounded-full border border-yellow-500/10 text-center px-3 py-1">
          Payment Required
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <button 
          onClick={handleView}
          className="text-(--text-main) hover:text-(--accent) transition-colors cursor-pointer p-2 hover:bg-(--bg-less-dark)/50 rounded-lg" 
          title="View Details"
        >
          <Eye size={20} />
        </button>
        <button 
          onClick={handleDownload}
          className="text-(--text-main) hover:text-(--accent) transition-colors cursor-pointer p-2 hover:bg-(--bg-less-dark)/50 rounded-lg" 
          title="Download Invoice"
        >
          <Download size={20} />
        </button>
      </div>

      <InvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={order} 
        user={user} 
      />
    </>
  );
}
