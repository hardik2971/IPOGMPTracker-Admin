"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Send } from "lucide-react";
import { mockNotifications } from "@/data/mockData";
import { Notification } from "@/types";
import { formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "push" as "push" | "email" | "in-app",
  });

  const handleOpenModal = () => {
    setFormData({
      title: "",
      message: "",
      type: "push",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setNotifications([...notifications, newNotification]);
    handleCloseModal();
  };

  const columns = useMemo<ColumnDef<Notification>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => (
          <div className="max-w-md truncate">{row.original.message}</div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.original.type;
          const colors = {
            push: "bg-blue-100 text-blue-800",
            email: "bg-purple-100 text-purple-800",
            "in-app": "bg-green-100 text-green-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}
            >
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const colors = {
            sent: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            failed: "bg-red-100 text-red-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
    ],
    []
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Manage push notifications, emails, and in-app notifications
            </p>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>

        <DataTable
          data={notifications}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Search notifications..."
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Send Notification"
          footer={
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    type: value as "push" | "email" | "in-app",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push">Push Notification</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="in-app">In-App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}
