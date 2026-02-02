"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "IPOG",
    siteUrl: "https://www.ipog.com",
    email: "admin@ipog.com",
    phone: "+91 1234567890",
    currency: "INR",
    timezone: "Asia/Kolkata",
    paymentGateway: "razorpay",
    razorpayKey: "",
    razorpaySecret: "",
    seoTitle: "IPOG - IPO Management Platform",
    seoDescription: "Manage and invest in IPOs with IPOG",
    seoKeywords: "IPO, investment, stocks",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage system settings and configuration
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site Name
                </label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Site URL</label>
                <Input
                  value={settings.siteUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, siteUrl: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <Select
                  value={settings.currency}
                  onValueChange={(value: string) =>
                    setSettings({ ...settings, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value: string) =>
                    setSettings({ ...settings, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Gateway Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Gateway
              </label>
              <Select
                value={settings.paymentGateway}
                onValueChange={(value: string) =>
                  setSettings({ ...settings, paymentGateway: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <Input
                  type="password"
                  value={settings.razorpayKey}
                  onChange={(e) =>
                    setSettings({ ...settings, razorpayKey: e.target.value })
                  }
                  placeholder="Enter API Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Secret
                </label>
                <Input
                  type="password"
                  value={settings.razorpaySecret}
                  onChange={(e) =>
                    setSettings({ ...settings, razorpaySecret: e.target.value })
                  }
                  placeholder="Enter API Secret"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">SEO Title</label>
              <Input
                value={settings.seoTitle}
                onChange={(e) =>
                  setSettings({ ...settings, seoTitle: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                SEO Description
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={settings.seoDescription}
                onChange={(e) =>
                  setSettings({ ...settings, seoDescription: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                SEO Keywords
              </label>
              <Input
                value={settings.seoKeywords}
                onChange={(e) =>
                  setSettings({ ...settings, seoKeywords: e.target.value })
                }
                placeholder="Comma-separated keywords"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input defaultValue="Admin User" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" defaultValue="admin@ipog.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Update Profile</Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
