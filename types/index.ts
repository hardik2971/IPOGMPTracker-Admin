export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  status: "active" | "inactive";
  publishDate: string;
  createdAt: string;
}

export interface IPO {
  id: string;
  name: string;
  companyName: string;
  openDate: string;
  closeDate: string;
  priceBand: {
    min: number;
    max: number;
  };
  lotSize: number;
  status: "upcoming" | "live" | "closed";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sub-admin" | "viewer";
  status: "active" | "blocked";
  createdAt: string;
  lastLogin?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
  status: "active" | "inactive";
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  productId?: string;
  productName?: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  type: "blog" | "page" | "banner";
  slug: string;
  content: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "push" | "email" | "in-app";
  status: "sent" | "pending" | "failed";
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeIPOs: number;
  totalUsers: number;
  revenue: number;
  subscriptionCount: number;
}
