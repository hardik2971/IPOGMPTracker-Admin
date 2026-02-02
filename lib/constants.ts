import {
  LayoutDashboard,
  Package,
  TrendingUp,
  FolderTree,
  Users,
  CreditCard,
  ShoppingCart,
  FileText,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react";

export const sidebarMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: "products",
    label: "Product Management",
    icon: Package,
    path: "/products",
  },
  {
    id: "ipos",
    label: "IPO Management",
    icon: TrendingUp,
    path: "/ipos",
  },
  {
    id: "categories",
    label: "Category Management",
    icon: FolderTree,
    path: "/categories",
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    path: "/users",
  },
  {
    id: "subscriptions",
    label: "Subscription Plans",
    icon: CreditCard,
    path: "/subscriptions",
  },
  {
    id: "orders",
    label: "Orders & Transactions",
    icon: ShoppingCart,
    path: "/orders",
  },
  {
    id: "content",
    label: "Content Management",
    icon: FileText,
    path: "/content",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    path: "/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
