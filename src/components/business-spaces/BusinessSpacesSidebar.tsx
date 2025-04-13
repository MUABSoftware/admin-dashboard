import { Building2, CreditCard, Home, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@src/components/ui/sidebar"
import { Link } from "react-router-dom"

const menuItems = [
  {
    title: "Overview",
    url: "/business-spaces",
    icon: Home,
  },
  {
    title: "Spaces",
    url: "/business-spaces/list",
    icon: Building2,
  },
  {
    title: "Payouts",
    url: "/business-spaces/payouts",
    icon: CreditCard,
  },
  {
    title: "Users",
    url: "/business-spaces/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/business-spaces/settings",
    icon: Settings,
  },
]

export function BusinessSpacesSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Spaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}