"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Package, TrendingUp, Users, CreditCard, ArrowUp, ArrowDown } from "lucide-react";
import { mockDashboardStats } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Jan", ipos: 4, users: 200 },
  { name: "Feb", ipos: 6, users: 350 },
  { name: "Mar", ipos: 8, users: 500 },
  { name: "Apr", ipos: 5, users: 400 },
  { name: "May", ipos: 7, users: 450 },
  { name: "Jun", ipos: 9, users: 600 },
];

const revenueData = [
  { name: "Jan", revenue: 1200000 },
  { name: "Feb", revenue: 1500000 },
  { name: "Mar", revenue: 1800000 },
  { name: "Apr", revenue: 2100000 },
  { name: "May", revenue: 2300000 },
  { name: "Jun", revenue: 2450000 },
];

export default function DashboardPage() {
  const stats = mockDashboardStats;

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active IPOs",
      value: stats.activeIPOs,
      icon: TrendingUp,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: "+18%",
      trend: "up",
    },
    {
      title: "Revenue",
      value: formatCurrency(stats.revenue),
      icon: CreditCard,
      change: "+22%",
      trend: "up",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your IPOG admin panel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-card rounded-lg border border-border p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">IPO Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ipos" fill="hsl(var(--primary))" name="IPOs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">User Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                name="Revenue"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New product added", user: "Admin", time: "2 hours ago" },
              { action: "IPO status updated", user: "Admin", time: "5 hours ago" },
              { action: "User subscription renewed", user: "System", time: "1 day ago" },
              { action: "Payment received", user: "System", time: "2 days ago" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    by {activity.user}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
