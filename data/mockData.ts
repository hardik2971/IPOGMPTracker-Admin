import { Product, IPO, Category, User, SubscriptionPlan, Transaction, Content, Notification, DashboardStats } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium IPO Analysis Package",
    category: "Analysis",
    price: 2999,
    description: "Comprehensive IPO analysis with detailed reports",
    status: "active",
    publishDate: "2024-01-15",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "IPO Subscription Guide",
    category: "Guide",
    price: 999,
    description: "Step-by-step guide for IPO subscriptions",
    status: "active",
    publishDate: "2024-01-20",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Market Trends Report",
    category: "Report",
    price: 1999,
    description: "Monthly market trends and IPO performance",
    status: "inactive",
    publishDate: "2024-02-01",
    createdAt: "2024-01-25",
  },
];

export const mockIPOs: IPO[] = [
  {
    id: "1",
    name: "TechCorp IPO",
    companyName: "TechCorp Industries Ltd.",
    openDate: "2024-03-01",
    closeDate: "2024-03-05",
    priceBand: { min: 200, max: 210 },
    lotSize: 50,
    status: "upcoming",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "FinTech Solutions IPO",
    companyName: "FinTech Solutions Pvt. Ltd.",
    openDate: "2024-02-15",
    closeDate: "2024-02-20",
    priceBand: { min: 150, max: 160 },
    lotSize: 100,
    status: "live",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "GreenEnergy IPO",
    companyName: "GreenEnergy Renewable Ltd.",
    openDate: "2024-01-10",
    closeDate: "2024-01-15",
    priceBand: { min: 180, max: 190 },
    lotSize: 75,
    status: "closed",
    createdAt: "2023-12-20",
  },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Analysis", slug: "analysis", description: "IPO analysis reports", createdAt: "2024-01-01" },
  { id: "2", name: "Guide", slug: "guide", description: "Subscription guides", createdAt: "2024-01-01" },
  { id: "3", name: "Report", slug: "report", description: "Market reports", createdAt: "2024-01-01" },
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-02-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "sub-admin",
    status: "active",
    createdAt: "2024-01-05",
    lastLogin: "2024-02-19",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "viewer",
    status: "blocked",
    createdAt: "2024-01-10",
  },
];

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Basic Plan",
    price: 999,
    duration: 1,
    features: ["Access to basic IPO data", "Email support"],
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Premium Plan",
    price: 2999,
    duration: 3,
    features: ["Full IPO analysis", "Priority support", "Advanced reports"],
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Enterprise Plan",
    price: 9999,
    duration: 12,
    features: ["All features", "Dedicated support", "Custom reports", "API access"],
    status: "active",
    createdAt: "2024-01-01",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    productId: "1",
    productName: "Premium IPO Analysis Package",
    amount: 2999,
    status: "completed",
    paymentMethod: "UPI",
    createdAt: "2024-02-15",
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    productId: "2",
    productName: "IPO Subscription Guide",
    amount: 999,
    status: "pending",
    paymentMethod: "Credit Card",
    createdAt: "2024-02-18",
  },
  {
    id: "3",
    userId: "3",
    userName: "Bob Wilson",
    amount: 2999,
    status: "failed",
    paymentMethod: "Net Banking",
    createdAt: "2024-02-19",
  },
];

export const mockContent: Content[] = [
  {
    id: "1",
    title: "How to Invest in IPOs",
    type: "blog",
    slug: "how-to-invest-in-ipos",
    content: "Complete guide on investing in IPOs...",
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "About Us",
    type: "page",
    slug: "about",
    content: "About IPOG...",
    status: "published",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New IPO Launch",
    message: "TechCorp IPO is now live",
    type: "push",
    status: "sent",
    createdAt: "2024-02-20",
  },
  {
    id: "2",
    title: "Welcome Email",
    message: "Welcome to IPOG",
    type: "email",
    status: "pending",
    createdAt: "2024-02-19",
  },
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: 12,
  activeIPOs: 3,
  totalUsers: 1250,
  revenue: 2450000,
  subscriptionCount: 850,
};
