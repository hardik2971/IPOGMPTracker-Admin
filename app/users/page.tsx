"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/select";
import { Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { mockUsers } from "@/data/mockData";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "active" ? "blocked" : "active",
            }
          : u
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role;
          const colors = {
            admin: "bg-purple-100 text-purple-800",
            "sub-admin": "bg-blue-100 text-blue-800",
            viewer: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}
            >
              {role}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "lastLogin",
        header: "Last Login",
        cell: ({ row }) =>
          row.original.lastLogin ? formatDate(row.original.lastLogin) : "Never",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleStatus(row.original.id)}
            >
              {row.original.status === "active" ? (
                <UserX className="h-4 w-4 text-red-500" />
              ) : (
                <UserCheck className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users and their roles
          </p>
        </div>

        <DataTable
          data={users}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search users..."
        />
      </div>
    </MainLayout>
  );
}
