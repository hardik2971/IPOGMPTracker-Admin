"use client";

import React, { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Download, Eye } from "lucide-react";
import { ViewModal, ViewField } from "@/components/ui/ViewModal";
import { mockTransactions } from "@/data/mockData";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export default function OrdersPage() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);

  const handleView = (transaction: Transaction) => {
    setViewingTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Transaction ID",
      },
      {
        accessorKey: "userName",
        header: "User",
      },
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => row.original.productName || "Subscription",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            completed: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
            refunded: "bg-gray-100 text-gray-800",
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
        accessorKey: "paymentMethod",
        header: "Payment Method",
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row.original)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders & Transactions</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all transactions
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <DataTable
          data={mockTransactions}
          columns={columns}
          searchKey="userName"
          searchPlaceholder="Search transactions..."
        />

        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingTransaction(null);
          }}
          title="Transaction Details"
          size="lg"
        >
          {viewingTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ViewField
                  label="Transaction ID"
                  value={viewingTransaction.id}
                />
                <ViewField
                  label="User Name"
                  value={viewingTransaction.userName}
                />
                <ViewField
                  label="Product"
                  value={viewingTransaction.productName || "Subscription"}
                />
                <ViewField
                  label="Amount"
                  value={formatCurrency(viewingTransaction.amount)}
                />
                <ViewField
                  label="Payment Method"
                  value={viewingTransaction.paymentMethod}
                />
                <ViewField
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingTransaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : viewingTransaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : viewingTransaction.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {viewingTransaction.status}
                    </span>
                  }
                />
                <ViewField
                  label="Transaction Date"
                  value={formatDate(viewingTransaction.createdAt)}
                />
                {viewingTransaction.productId && (
                  <ViewField
                    label="Product ID"
                    value={viewingTransaction.productId}
                  />
                )}
              </div>
            </div>
          )}
        </ViewModal>
      </div>
    </MainLayout>
  );
}
