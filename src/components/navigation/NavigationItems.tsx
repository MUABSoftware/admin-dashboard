"use client"
import {
  Users,
  Building2,
  Building,
  CreditCard,
  Store,
  Hash,
  Flag,
  // MessageSquare,
  // Shield,
  Tags,
  FileText,
  AlertCircle,
  ShoppingBag,
  MessageCircle,
} from "lucide-react"

export const userItems = [
  {
    title: "Users Management",
    url: "/users",
    icon: Users,
    description: "Manage all platform users",
  },
  {
    title: "Individual Business Spaces",
    url: "/business-spaces/individuals",
    icon: Building2,
    description: "Manage individual business spaces",
  },
  {
    title: "Company Business Spaces",
    url: "/business-spaces/companies",
    icon: Building,
    description: "Manage company business spaces",
  },
]

export const financeItems = [
  {
    title: "Payouts",
    url: "/business-spaces/payouts",
    icon: CreditCard,
    description: "Manage all payouts and transactions",
  },
  {
    title: "Digital Products",
    url: "/digital-products",
    icon: Store,
    description: "Manage digital products marketplace",
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
    description: "Manage marketplace tags and statistics",
  },
]

export const accessibilityItems = [
  {
    title: "Categories",
    url: "/categories",
    icon: FileText,
    description: "Manage content categories",
  },
  {
    title: "Topics",
    url: "/topics",
    icon: Hash,
    description: "Manage content topics and hashtags",
  },
  {
    title: "Sub-Categories",
    url: "/sub-categories",
    icon: Tags,
    description: "Manage content sub-categories",
  },
  {
    title: "Title Tags",
    url: "/title-tags",
    icon: Tags,
    description: "Manage title tags and metadata",
  },
  {
    title: "Special Tags",
    url: "/special-tags",
    icon: Tags,
    description: "Manage special content tags",
  },
]

export const reportItems = [
  {
    title: "User Reports",
    url: "/reports/users",
    icon: AlertCircle,
    description: "Review reports against users",
  },
  {
    title: "Post Reports",
    url: "/reports/posts",
    icon: Flag,
    description: "Review reports against posts",
  },
  {
    title: "Digital Product Reports",
    url: "/reports/products",
    icon: ShoppingBag,
    description: "Review reports against digital products",
  },
  {
    title: "Comment Reports",
    url: "/reports/comments",
    icon: MessageCircle,
    description: "Review reports against comments",
  },
]