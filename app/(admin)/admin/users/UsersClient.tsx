"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Edit3,
  Key,
  Ban,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileSpreadsheet,
  Trash2,
  Mail,
  User as UserIcon,
  Activity
} from "lucide-react";
import * as XLSX from "xlsx";
import { blockUser, deleteUser } from "@/actions/user";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  lastActive: Date | string;
  isBlocked: boolean;
  createdAt: Date | string;
}

interface UsersClientProps {
  initialUsers: User[];
  totalUserCount: number;
}

export default function UsersClient({ initialUsers, totalUserCount }: UsersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => {
      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [initialUsers, searchTerm, roleFilter]);

  // Sorting logic
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig !== null) {
      sortableUsers.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
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
    const exportData = sortedUsers.map(user => ({
      "Name": user.name || "Anonymous",
      "Email": user.email,
      "Role": user.role,
      "Joined Date": new Date(user.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `Innovix_Users_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleBlock = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;
    const res = await blockUser(userId, !currentStatus);
    if (res.error) alert(res.error);
    else window.location.reload();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) return;
    const res = await deleteUser(userId);
    if (res.error) alert(res.error);
    else window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-(--bg-dark) p-6 rounded-[32px] border border-(--bg-less-dark)/50 shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] group-focus-within:text-(--accent) transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-(--accent)/50 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* <div className="relative">
            <select 
              className="appearance-none bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) pl-4 pr-10 py-3.5 rounded-2xl focus:outline-none focus:border-(--accent)/50 transition-all text-sm cursor-pointer min-w-[150px]"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Roles</option>
              <option value="USER">Standard User</option>
              <option value="ADMIN">Admin (Hidden)</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" size={14} />
          </div> */}

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-(--bg-less-dark)/50 transition-all cursor-pointer group"
          >
            <FileSpreadsheet size={18} className="text-gray-500 group-hover:text-(--accent) transition-colors" />
            Export List
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-(--bg-dark) border border-(--bg-less-dark)/50 rounded-[32px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-(--bg-less-dark)/50 bg-(--bg-less-dark)/5">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">User Identity <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('role')}>
                  <div className="flex items-center gap-2">Role <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666]">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Joined Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] cursor-pointer hover:text-(--accent) transition-colors" onClick={() => handleSort('lastActive')}>
                  <div className="flex items-center gap-2">Last Active <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[#666] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? paginatedUsers.map((user, i) => (
                <tr key={user.id} className="border-b border-(--bg-less-dark)/30 last:border-none group hover:bg-(--bg-less-dark)/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          className="w-11 h-11 rounded-2xl object-cover border border-(--bg-less-dark)"
                          alt={user.name || "User"}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-(--bg-dark) rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-bold text-(--text-main) group-hover:text-(--accent) transition-colors">{user.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-(--accent)/10 text-(--accent) border border-(--accent)/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/10'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 font-bold text-[11px] uppercase tracking-tighter ${user.isBlocked ? 'text-red-500' : 'text-green-400'}`}>
                      {user.isBlocked ? (
                        <>
                          <Ban size={12} />
                          Blocked
                        </>
                      ) : (
                        <>
                          <Activity size={12} className="animate-pulse" />
                          Active
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium text-sm">
                    <span suppressHydrationWarning>
                      {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium text-sm">
                    <span suppressHydrationWarning>
                      {new Date(user.lastActive).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleBlock(user.id, user.isBlocked)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${user.isBlocked ? 'text-green-500 bg-green-500/10 hover:bg-green-500/20' : 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'}`} 
                        title={user.isBlocked ? "Unblock Account" : "Block Account"}
                      >
                        <Ban size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer" 
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-(--bg-less-dark)/30 rounded-full flex items-center justify-center border border-(--bg-less-dark)">
                        <Users className="text-[#666]" size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">No users found matching your search.</p>
                      <button
                        onClick={() => { setSearchTerm(""); setRoleFilter("All"); }}
                        className="text-(--accent) text-sm font-bold hover:underline"
                      >
                        Clear search filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-(--bg-less-dark)/5 border-t border-(--bg-less-dark)/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-xs font-bold uppercase tracking-widest">
            Displaying <span className="text-(--text-main)">{paginatedUsers.length}</span> of <span className="text-(--text-main)">{filteredUsers.length}</span> users
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-[10px] font-bold text-[#666] uppercase">Rows:</span>
              <select
                className="bg-(--bg-less-dark)/30 border border-(--bg-less-dark) text-(--text-main) text-xs rounded-lg px-2 py-1 outline-none"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[10, 20, 50, 100].map(val => (
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
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${currentPage === page
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
