"use client";

import React, { useState, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { ViewModal, ViewField } from "@/components/ui/ViewModal";
import { mockIPOs } from "@/data/mockData";
import { IPO } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Select } from "@/components/ui/select";

export default function IPOsPage() {
  const [ipos, setIpos] = useState<IPO[]>(mockIPOs || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingIPO, setViewingIPO] = useState<IPO | null>(null);
  const [editingIPO, setEditingIPO] = useState<IPO | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    openDate: "",
    closeDate: "",
    minPrice: "",
    maxPrice: "",
    lotSize: "",
    status: "upcoming" as "upcoming" | "live" | "closed",
  });

  const handleOpenModal = useCallback((ipo?: IPO) => {
    if (ipo) {
      setEditingIPO(ipo);
      setFormData({
        name: ipo.name,
        companyName: ipo.companyName,
        openDate: ipo.openDate,
        closeDate: ipo.closeDate,
        minPrice: ipo.priceBand?.min?.toString() || "",
        maxPrice: ipo.priceBand?.max?.toString() || "",
        lotSize: ipo.lotSize?.toString() || "",
        status: ipo.status,
      });
    } else {
      setEditingIPO(null);
      setFormData({
        name: "",
        companyName: "",
        openDate: "",
        closeDate: "",
        minPrice: "",
        maxPrice: "",
        lotSize: "",
        status: "upcoming",
      });
    }
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIPO(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIPO) {
      setIpos((prev) =>
        prev.map((i) =>
          i.id === editingIPO.id
            ? {
                ...i,
                name: formData.name,
                companyName: formData.companyName,
                openDate: formData.openDate,
                closeDate: formData.closeDate,
                priceBand: {
                  min: Number(formData.minPrice) || 0,
                  max: Number(formData.maxPrice) || 0,
                },
                lotSize: Number(formData.lotSize) || 0,
                status: formData.status,
              }
            : i,
        ),
      );
    } else {
      const newIPO: IPO = {
        id: Date.now().toString(),
        name: formData.name,
        companyName: formData.companyName,
        openDate: formData.openDate,
        closeDate: formData.closeDate,
        priceBand: {
          min: Number(formData.minPrice) || 0,
          max: Number(formData.maxPrice) || 0,
        },
        lotSize: Number(formData.lotSize) || 0,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setIpos((prev) => [...prev, newIPO]);
    }
    handleCloseModal();
  };

  const handleView = useCallback((ipo: IPO) => {
    setViewingIPO(ipo);
    setIsViewModalOpen(true);
  }, []);

  const handleDelete = React.useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this IPO?")) {
      setIpos((prev) => prev.filter((i) => i.id !== id));
    }
  }, []);

  const columns = useMemo<ColumnDef<IPO>[]>(
    () => [
      {
        accessorKey: "name",
        header: "IPO Name",
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
      },
      {
        accessorKey: "openDate",
        header: "Open Date",
        cell: ({ row }) => {
          try {
            return formatDate(row.original.openDate);
          } catch (e) {
            return row.original.openDate;
          }
        },
      },
      {
        accessorKey: "closeDate",
        header: "Close Date",
        cell: ({ row }) => {
          try {
            return formatDate(row.original.closeDate);
          } catch (e) {
            return row.original.closeDate;
          }
        },
      },
      {
        id: "priceBand",
        header: "Price Band",
        cell: ({ row }) => {
          try {
            return `${formatCurrency(row.original.priceBand.min)} - ${formatCurrency(row.original.priceBand.max)}`;
          } catch (e) {
            return "N/A";
          }
        },
      },
      {
        accessorKey: "lotSize",
        header: "Lot Size",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const colors = {
            upcoming: "bg-blue-100 text-blue-800",
            live: "bg-green-100 text-green-800",
            closed: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}
            >
              {status}
            </span>
          );
        },
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
    [handleDelete, handleOpenModal, handleView],
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">IPO Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage IPO listings and details
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add IPO
          </Button>
        </div>

        {ipos && ipos.length > 0 ? (
          <DataTable
            data={ipos}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search IPOs..."
          />
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">
              No IPOs found. Add your first IPO to get started.
            </p>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingIPO ? "Edit IPO" : "Add IPO"}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingIPO ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">IPO Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Open Date
                </label>
                <Input
                  type="date"
                  value={formData.openDate}
                  onChange={(e) =>
                    setFormData({ ...formData, openDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Close Date
                </label>
                <Input
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) =>
                    setFormData({ ...formData, closeDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Price
                </label>
                <Input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, minPrice: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Price
                </label>
                <Input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPrice: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lot Size</label>
              <Input
                type="number"
                value={formData.lotSize}
                onChange={(e) =>
                  setFormData({ ...formData, lotSize: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "upcoming" | "live" | "closed",
                  })
                }
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="closed">Closed</option>
              </Select>
            </div>
          </form>
        </Modal>

        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingIPO(null);
          }}
          title="IPO Details"
          size="lg"
        >
          {viewingIPO && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ViewField
                  label="IPO Name"
                  value={viewingIPO.name}
                />
                <ViewField
                  label="Company Name"
                  value={viewingIPO.companyName}
                />
                <ViewField
                  label="Open Date"
                  value={formatDate(viewingIPO.openDate)}
                />
                <ViewField
                  label="Close Date"
                  value={formatDate(viewingIPO.closeDate)}
                />
                <ViewField
                  label="Price Band"
                  value={`${formatCurrency(viewingIPO.priceBand.min)} - ${formatCurrency(viewingIPO.priceBand.max)}`}
                />
                <ViewField
                  label="Lot Size"
                  value={viewingIPO.lotSize}
                />
                <ViewField
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingIPO.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : viewingIPO.status === "live"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {viewingIPO.status}
                    </span>
                  }
                />
                <ViewField
                  label="Created Date"
                  value={formatDate(viewingIPO.createdAt)}
                />
              </div>
            </div>
          )}
        </ViewModal>
      </div>
    </MainLayout>
  );
}
