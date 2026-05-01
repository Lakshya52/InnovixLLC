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
  Zap,
  Users,
  Package
} from "lucide-react";
import { getDashboardStats, getOrdersWithPagination } from "@/actions/dashboard";
import Link from "next/link";
import DashboardOrdersClient from "./DashboardOrdersClient";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const stats = await getDashboardStats();
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status;
  const initialOrdersData = await getOrdersWithPagination(1, 10, statusFilter);

  return (
    <div className="p-4 md:p-8 mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin <span className="text-(--accent)">Dashboard</span></h1>
          <p className="text-(--text-main) text-sm">Real-time insights into your enterprise software business.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-(--accent) block hover:border-(--bg-less-dark) transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold">${Number(stats.revenue).toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-(--bg-dark) rounded-2xl text-gray-400 group-hover:text-(--accent) transition-colors">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className={`text-xs font-bold flex items-center gap-1 ${Number(stats.revenueChange) >= 0 ? "text-(--accent)" : "text-red-500"
            }`}>
            <TrendingUp size={14} /> {Number(stats.revenueChange) >= 0 ? "+" : ""}{stats.revenueChange}% vs last month
          </p>
        </div>

        <div className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-yellow-500 block hover:border-(--bg-less-dark) transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-(--bg-dark) rounded-2xl text-gray-400 group-hover:text-yellow-500 transition-colors">
              <ShoppingBag size={24} />
            </div>
          </div>
          <p className="text-yellow-500 text-xs font-bold flex items-center gap-1">
            <Zap size={14} className="fill-yellow-500" /> All time orders
          </p>
        </div>

        <Link href="/admin/users" className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8 relative overflow-hidden group border-l-4 border-l-blue-500 block hover:border-(--bg-less-dark) transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Users</p>
              <h3 className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-(--bg-dark) rounded-2xl text-gray-400 group-hover:text-blue-500 transition-colors">
              <Users size={24} />
            </div>
          </div>
          <p className="text-blue-500 text-xs font-bold flex items-center gap-1">
            <Users size={14} /> Registered customers
          </p>
        </Link>

        <Link href="/admin/inventory" className="bg-(--bg-dark) border border-(--bg-dark) rounded-[32px] p-8 relative overflow-hidden group block hover:border-(--bg-less-dark) transition-all cursor-pointer">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Fulfillment Rate</p>
              <h3 className="text-3xl font-bold">{stats.fulfillmentRate}%</h3>
            </div>
          </div>
          <div className="h-1.5 bg-(--bg-dark) rounded-full overflow-hidden mb-4">
            <div className="h-full bg-(--accent) shadow-[0_0_10_rgba(110,221,134,0.3)]" style={{ width: `${stats.fulfillmentRate}%` }}></div>
          </div>
          <p className="text-gray-500 text-[10px] italic font-medium uppercase tracking-tighter">Industry leading performance</p>
        </Link>
      </div>

      <DashboardOrdersClient initialData={initialOrdersData} initialStatus={statusFilter} />
    </div>
  );
}
