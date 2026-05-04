"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Search, 
  Shield, 
  User, 
  MoreVertical,
  Mail,
  Calendar,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { fetchUsers, updateAdminUser } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(null);

  const loadUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchUsers(token);
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to make this user an ${newRole}?`)) return;

    try {
      setIsUpdating(userId);
      await updateAdminUser(token, userId, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.message || "Failed to update user");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-brand-blue uppercase tracking-tight">User Management</h2>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Manage administrative privileges and view registered users</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-brand transition-all text-sm font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white border border-slate-200 rounded-sm">
          <Loader2 className="animate-spin text-brand" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Users...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">User Profile</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-blue">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRoleToggle(user._id, user.role)}
                      disabled={isUpdating === user._id}
                      className="text-[9px] font-black uppercase tracking-widest text-brand hover:text-brand-dark transition-colors disabled:opacity-50"
                    >
                      {isUpdating === user._id ? "Updating..." : (user.role === 'admin' ? "Make User" : "Make Admin")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-sm italic">No users found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
