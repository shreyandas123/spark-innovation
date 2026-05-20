"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Users, Activity, Eye, Zap, TrendingDown } from "lucide-react";
import { fetchAnalyticsData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const COLORS = ["#f43f5e", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function AnalyticsOverview() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [token]);

  const loadAnalyticsData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAnalyticsData(token);
      setAnalyticsData(data.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
      showToast("Failed to load analytics data", "error");
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-sm animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-sm">
        <p className="text-sm text-red-600 font-bold">{error || "Unable to load analytics data"}</p>
      </div>
    );
  }

  const { summary, usersOverTime, topPages, trafficSources, deviceCategories, topReferrers } = analyticsData;

  const metrics = [
    { label: "Total Users", value: summary.totalUsers, icon: <Users size={20} />, color: "bg-blue-100 text-blue-600" },
    { label: "Total Sessions", value: summary.totalSessions, icon: <Activity size={20} />, color: "bg-purple-100 text-purple-600" },
    { label: "Page Views", value: summary.totalPageViews, icon: <Eye size={20} />, color: "bg-indigo-100 text-indigo-600" },
    { label: "Avg Session", value: summary.avgSessionDuration, icon: <Zap size={20} />, color: "bg-green-100 text-green-600" },
    { label: "Bounce Rate", value: `${summary.bounceRate}%`, icon: <TrendingDown size={20} />, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-sm ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
            <h3 className="text-2xl font-black text-brand-blue mb-1">{metric.value}</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Users & Sessions Chart */}
      <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
        <h2 className="text-lg font-black text-brand-blue uppercase tracking-tight mb-6">Users & Sessions (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={usersOverTime}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorUsers)"
              name="Users"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorSessions)"
              name="Sessions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Pages & Traffic Sources */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h2 className="text-lg font-black text-brand-blue uppercase tracking-tight mb-6">Top Pages</h2>
          <div className="space-y-4">
            {topPages?.slice(0, 5).map((page, idx) => (
              <div key={idx} className="pb-4 border-b border-slate-100 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-slate-700">{page.page}</p>
                  <span className="text-[9px] font-black text-brand bg-brand/10 px-2 py-1 rounded-sm">{page.pageViews} views</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{page.users} users</span>
                  <span>Avg: {page.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources Pie Chart */}
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h2 className="text-lg font-black text-brand-blue uppercase tracking-tight mb-6">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSources?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Categories & Weekly Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device Categories */}
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h2 className="text-lg font-black text-brand-blue uppercase tracking-tight mb-6">Device Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deviceCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="device" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px" }}
              />
              <Bar dataKey="sessions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h2 className="text-lg font-black text-brand-blue uppercase tracking-tight mb-6">Weekly Comparison</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px" }}
              />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" name="Users" radius={[8, 8, 0, 0]} />
              <Bar dataKey="sessions" fill="#8b5cf6" name="Sessions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
