"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, updateAdminUser } from "@/lib/api";
import { 
  Users, 
  Search, 
  UserCircle, 
  Mail, 
  Calendar, 
  Shield, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCcw
} from "lucide-react";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [token]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers(token);
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      setUpdatingId(userId);
      await updateAdminUser(token, userId, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-reveal">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight mb-2">User Management</h1>
          <p className="text-slate-500 text-sm font-medium">View and manage all registered accounts on Spark Innovations.</p>
        </div>
        <button 
          onClick={loadUsers}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand hover:border-brand transition-all"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh List
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
              <h3 className="text-2xl font-black text-brand-blue leading-none">{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admins</p>
              <h3 className="text-2xl font-black text-brand-blue leading-none">
                {users.filter(u => u.role === 'admin').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-blue/5 text-brand-blue rounded-full flex items-center justify-center">
              <UserCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Customers</p>
              <h3 className="text-2xl font-black text-brand-blue leading-none">
                {users.filter(u => u.role === 'user').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {filteredUsers.length} Users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Joined On</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-brand mx-auto mb-4" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Accounts...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <XCircle className="text-slate-200 mx-auto mb-4" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/5 text-brand-blue flex items-center justify-center font-black text-sm border border-slate-100 uppercase">
                          {user.name?.charAt(0) || <UserCircle size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-brand-blue uppercase tracking-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {user._id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} className="text-slate-300" />
                          <span className="text-xs font-medium">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-[10px] font-bold text-slate-400">T: {user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="text-slate-300" />
                        <span className="text-xs font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.role === 'admin' 
                          ? 'bg-brand text-white' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {user.role === 'admin' ? <Shield size={10} /> : <UserCircle size={10} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {updatingId === user._id ? (
                        <Loader2 className="animate-spin text-brand ml-auto" size={20} />
                      ) : (
                        <button 
                          onClick={() => handleRoleToggle(user._id, user.role)}
                          className="p-2 text-slate-400 hover:text-brand hover:bg-white rounded-sm transition-all"
                          title="Toggle Role"
                        >
                          <RefreshCcw size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
