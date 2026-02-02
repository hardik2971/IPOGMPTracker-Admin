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
import { mockContent } from "@/data/mockData";
import { Content } from "@/types";
import { formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export default function ContentPage() {
  const [content, setContent] = useState(mockContent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingContent, setViewingContent] = useState<Content | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "blog" as "blog" | "page" | "banner",
    slug: "",
    content: "",
    status: "draft" as "published" | "draft",
  });

  const handleOpenModal = (item?: Content) => {
    if (item) {
      setEditingContent(item);
      setFormData({
        title: item.title,
        type: item.type,
        slug: item.slug,
        content: item.content,
        status: item.status,
      });
    } else {
      setEditingContent(null);
      setFormData({
        title: "",
        type: "blog",
        slug: "",
        content: "",
        status: "draft",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContent) {
      setContent(
        content.map((c) =>
          c.id === editingContent.id
            ? {
                ...c,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : c
        )
      );
    } else {
      const newContent: Content = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setContent([...content, newContent]);
    }
    handleCloseModal();
  };

  const handleView = (item: Content) => {
    setViewingContent(item);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      setContent(content.filter((c) => c.id !== id));
    }
  };

  const columns = useMemo<ColumnDef<Content>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.original.type;
          const colors = {
            blog: "bg-blue-100 text-blue-800",
            page: "bg-purple-100 text-purple-800",
            banner: "bg-green-100 text-green-800",
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
        accessorKey: "slug",
        header: "Slug",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === "published"
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
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage blogs, pages, and banners
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>

        <DataTable
          data={content}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Search content..."
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingContent ? "Edit Content" : "Add Content"}
          size="xl"
          footer={
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingContent ? "Update" : "Create"}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      type: value as "blog" | "page" | "banner",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      status: value as "published" | "draft",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
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
            setViewingContent(null);
          }}
          title="Content Details"
          size="xl"
        >
          {viewingContent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ViewField
                  label="Title"
                  value={viewingContent.title}
                />
                <ViewField
                  label="Type"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingContent.type === "blog"
                          ? "bg-blue-100 text-blue-800"
                          : viewingContent.type === "page"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {viewingContent.type}
                    </span>
                  }
                />
                <ViewField
                  label="Slug"
                  value={viewingContent.slug}
                />
                <ViewField
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        viewingContent.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {viewingContent.status}
                    </span>
                  }
                />
                <ViewField
                  label="Created Date"
                  value={formatDate(viewingContent.createdAt)}
                />
                <ViewField
                  label="Updated Date"
                  value={formatDate(viewingContent.updatedAt)}
                />
              </div>
              <ViewField
                label="Content"
                value={
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    {viewingContent.content}
                  </div>
                }
                className="col-span-2"
              />
            </div>
          )}
        </ViewModal>
      </div>
    </MainLayout>
  );
}
