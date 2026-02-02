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
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { ViewModal, ViewField } from "@/components/ui/ViewModal";
import { mockProducts, mockCategories } from "@/data/mockData";
import { Product } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    status: "active" as "active" | "inactive",
    publishDate: "",
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        status: product.status,
        publishDate: product.publishDate,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        status: "active",
        publishDate: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: Number(formData.price),
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        price: Number(formData.price),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => formatCurrency(row.original.price),
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
    []
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your IPO-related products
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <DataTable
          data={products}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search products..."
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? "Edit Product" : "Add Product"}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingProduct ? "Update" : "Create"}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                value={formData.category || undefined}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                Description
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Publish Date
              </label>
              <Input
                type="date"
                value={formData.publishDate}
                onChange={(e) =>
                  setFormData({ ...formData, publishDate: e.target.value })
                }
                required
              />
            </div>
          </form>
        </Modal>

        <ViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingProduct(null);
          }}
          title="Product Details"
          size="lg"
        >
          {viewingProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ViewField
                  label="Product Name"
                  value={viewingProduct.name}
                />
                <ViewField
                  label="Category"
                  value={viewingProduct.category}
                />
                <ViewField
                  label="Price"
                  value={formatCurrency(viewingProduct.price)}
                />
                <ViewField
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingProduct.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {viewingProduct.status}
                    </span>
                  }
                />
                <ViewField
                  label="Publish Date"
                  value={formatDate(viewingProduct.publishDate)}
                />
                <ViewField
                  label="Created Date"
                  value={formatDate(viewingProduct.createdAt)}
                />
              </div>
              <ViewField
                label="Description"
                value={
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {viewingProduct.description}
                  </div>
                }
                className="col-span-2"
              />
              {viewingProduct.image && (
                <ViewField
                  label="Image"
                  value={
                    <img
                      src={viewingProduct.image}
                      alt={viewingProduct.name}
                      className="max-w-xs rounded-lg border"
                    />
                  }
                />
              )}
            </div>
          )}
        </ViewModal>
      </div>
    </MainLayout>
  );
}
