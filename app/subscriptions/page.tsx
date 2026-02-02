"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { mockPlans } from "@/data/mockData";
import { SubscriptionPlan } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ViewModal, ViewField } from "@/components/ui/ViewModal";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
    status: "active" as "active" | "inactive",
  });

  const handleOpenModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        duration: plan.duration.toString(),
        features: plan.features.join("\n"),
        status: plan.status,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        price: "",
        duration: "",
        features: "",
        status: "active",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      setPlans(
        plans.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                ...formData,
                price: Number(formData.price),
                duration: Number(formData.duration),
                features: formData.features.split("\n").filter((f) => f.trim()),
              }
            : p
        )
      );
    } else {
      const newPlan: SubscriptionPlan = {
        id: Date.now().toString(),
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        features: formData.features.split("\n").filter((f) => f.trim()),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPlans([...plans, newPlan]);
    }
    handleCloseModal();
  };

  const handleView = (plan: SubscriptionPlan) => {
    setViewingPlan(plan);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter((p) => p.id !== id));
    }
  };

  const columns = useMemo<ColumnDef<SubscriptionPlan>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Plan Name",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => formatCurrency(row.original.price),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => `${row.original.duration} month(s)`,
      },
      {
        id: "features",
        header: "Features",
        cell: ({ row }) => (
          <div className="max-w-xs">
            <ul className="list-disc list-inside text-sm">
              {row.original.features.slice(0, 2).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
              {row.original.features.length > 2 && (
                <li className="text-muted-foreground">
                  +{row.original.features.length - 2} more
                </li>
              )}
            </ul>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(row.original)}
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenModal(row.original)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [handleView, handleOpenModal, handleDelete]
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-muted-foreground mt-1">
              Manage subscription plans and pricing
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <DataTable
          data={plans}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search plans..."
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingPlan ? "Edit Plan" : "Add Plan"}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingPlan ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Plan Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (months)
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Features (one per line)
              </label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    status: value as "active" | "inactive",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </form>
        </Modal>

        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingPlan(null);
          }}
          title="Plan Details"
          size="lg"
        >
          {viewingPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ViewField label="Plan Name" value={viewingPlan.name} />
                <ViewField
                  label="Price"
                  value={formatCurrency(viewingPlan.price)}
                />
                <ViewField
                  label="Duration"
                  value={`${viewingPlan.duration} month(s)`}
                />
                <ViewField
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingPlan.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {viewingPlan.status}
                    </span>
                  }
                />
                <ViewField
                  label="Created Date"
                  value={formatDate(viewingPlan.createdAt)}
                />
              </div>
              <ViewField
                label="Features"
                value={
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {viewingPlan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                }
              />
            </div>
          )}
        </ViewModal>
      </div>
    </MainLayout>
  );
}
