"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Plus, Edit, Trash2, Eye, Loader2, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { ViewModal, ViewField } from "@/components/ui/ViewModal";
import { IPO } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchIPOs } from "@/lib/ipoApi";

const PAGE_LIMIT = 10;

export default function IPOsPage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
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
    ipoType: "",
    issueSize: "",
    premium: "",
    iconUrl: "",
    status: "upcoming" as "upcoming" | "live" | "closed",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchIPOs(page, PAGE_LIMIT).then((result) => {
      if (cancelled) return;
      setIpos(result.ipos);
      setPagination({
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
        hasNextPage: result.pagination.hasNextPage,
        hasPrevPage: result.pagination.hasPrevPage,
      });
      setError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

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
        ipoType: ipo.ipoType || "",
        issueSize: ipo.issueSize || "",
        premium: ipo.premium || "",
        iconUrl: ipo.iconUrl || "",
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
        ipoType: "",
        issueSize: "",
        premium: "",
        iconUrl: "",
        status: "upcoming",
      });
    }
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIPO(null);
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, iconUrl: dataUrl }));
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    []
  );

  const clearImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, iconUrl: "" }));
  }, []);

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
              ipoType: formData.ipoType || undefined,
              issueSize: formData.issueSize || undefined,
              premium: formData.premium || undefined,
              iconUrl: formData.iconUrl || undefined,
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
        ipoType: formData.ipoType || undefined,
        issueSize: formData.issueSize || undefined,
        premium: formData.premium || undefined,
        iconUrl: formData.iconUrl || undefined,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setIpos((prev) => [newIPO, ...prev]);
    }
    handleCloseModal();
  };

  const goToPrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(pagination.totalPages, p + 1));
  }, [pagination.totalPages]);

  const handleView = useCallback((ipo: IPO) => {
    setViewingIPO(ipo);
    setIsViewModalOpen(true);
  }, []);

  const handleApply = useCallback((ipo: IPO) => {
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
        id: "logo",
        header: "",
        cell: ({ row }) => {
          const ipo = row.original;
          const initials = (ipo.name || "IP")
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          if (ipo.iconUrl) {
            return (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                <img
                  src={ipo.iconUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
            );
          }
          return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Company Name",
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
      },
      {
        id: "ipoType",
        header: "IPO Type",
        cell: ({ row }) => {
          const t = row.original.ipoType || "—";
          return (
            <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {t}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const config = {
            live: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
            closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          };
          const label = status === "live" ? "Live" : status === "upcoming" ? "Upcoming" : "Closed";
          return (
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${config[status] || config.closed}`}>
              {status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              {label}
            </span>
          );
        },
      },
      {
        id: "offerDate",
        header: "Offer Date",
        cell: ({ row }) => {
          const o = row.original;
          if (!o.openDate && !o.closeDate) return "—";
          const open = o.openDate ? formatDate(o.openDate) : "—";
          const close = o.closeDate ? formatDate(o.closeDate) : "—";
          return `${open} - ${close}`;
        },
      },
      {
        id: "offerPrice",
        header: "Offer Price",
        cell: ({ row }) => {
          const { min, max } = row.original.priceBand || {};
          if (min == null && max == null) return "—";
          return `${min ?? 0}-${max ?? 0}`;
        },
      },
      {
        accessorKey: "lotSize",
        header: "Lot Size",
        cell: ({ row }) => row.original.lotSize ?? "—",
      },
      {
        id: "subscription",
        header: "Subscription",
        cell: ({ row }) => {
          const issueSize = row.original.issueSize;
          if (issueSize) return `Issue: ${issueSize} Cr`;
          return "—";
        },
      },
      {
        id: "premium",
        header: "Exp. Premium",
        cell: ({ row }) => {
          const p = row.original.premium;
          if (!p) return "—";
          return <span className="text-green-600 dark:text-green-400">{p}</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleView(row.original);
              }}
              className="border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-900/20"
            >
              View
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApply(row.original);
              }}
              className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              Apply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(row.original);
              }}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [handleApply, handleDelete, handleOpenModal, handleView],
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

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center rounded-lg border border-border bg-card py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : ipos && ipos.length > 0 ? (
          <>
            <DataTable
              data={ipos}
              columns={columns}
              searchKey="name"
              searchPlaceholder="Search IPOs..."
              hidePagination
            />
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {(page - 1) * PAGE_LIMIT + 1} to{" "}
                  {Math.min(page * PAGE_LIMIT, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">
              No IPOs found. Add your first IPO to get started.
            </p>
          </div>
        )}

      </div>
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium mb-2">IPO Type</label>
                <Select
                  value={formData.ipoType || "__none__"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      ipoType: value === "__none__" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Select type</SelectItem>
                    <SelectItem value="SME">SME</SelectItem>
                    <SelectItem value="Mainboard">Mainboard</SelectItem>
                  </SelectContent>
                </Select>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Issue Size (Cr)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 86.08"
                  value={formData.issueSize}
                  onChange={(e) =>
                    setFormData({ ...formData, issueSize: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Exp. Premium
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 12 (6.8%)"
                  value={formData.premium}
                  onChange={(e) =>
                    setFormData({ ...formData, premium: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Logo
              </label>
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <Upload className="h-4 w-4" />
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <span className="text-xs text-muted-foreground">
                      or paste URL below
                    </span>
                  </div>
                  <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={
                      formData.iconUrl?.startsWith("http")
                        ? formData.iconUrl
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iconUrl: e.target.value || "",
                      })
                    }
                    className="max-w-xs"
                  />
                </div>
                {formData.iconUrl && (
                  <div className="relative">
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                      <img
                        src={formData.iconUrl}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
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
              {viewingIPO.iconUrl && (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
                    <img
                      src={viewingIPO.iconUrl}
                      alt="Company logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Company Logo
                  </span>
                </div>
              )}
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
                  label="IPO Type"
                  value={viewingIPO.ipoType || "—"}
                />
                <ViewField
                  label="Issue Size"
                  value={viewingIPO.issueSize ? `${viewingIPO.issueSize} Cr` : "—"}
                />
                <ViewField
                  label="Exp. Premium"
                  value={viewingIPO.premium || "—"}
                />
                <ViewField
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${viewingIPO.status === "upcoming"
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
    </MainLayout>
  );
}
