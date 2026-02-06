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
  /** From API: display in table card */
  iconUrl?: string;
  ipoType?: string;
  premium?: string;
  issueSize?: string;
}

/** API response shape for IPO (snake_case from backend) */
export interface IPOApiResponse {
  id: number;
  name: string;
  open: string;
  close: string;
  start_time?: string;
  end_time?: string;
  script_code?: string;
  icon_url?: string;
  min_price: string;
  max_price: string;
  lot_size: number;
  premium?: string;
  allotment_date?: string;
  listing_date?: string;
  allotment_link?: string | null;
  is_buyer?: number;
  is_seller?: number;
  is_pre_apply?: number;
  issue_size?: string;
  current_status: string;
  ipo_type?: string;
  listing_price?: string | null;
  slug?: string;
  created_at: string;
  updated_at?: string;
  lead_managers?: Array<{
    id: number;
    name: string;
    about_section?: string;
    logo?: string;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
    pivot?: { ipo_id: number; lead_manager_id: number };
  }>;
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
