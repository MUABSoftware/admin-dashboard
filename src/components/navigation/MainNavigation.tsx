"use client"
import { Shield, Bell, Settings, HelpCircle } from "lucide-react"

import { NavigationMenu, NavigationMenuList } from "@src/components/ui/navigation-menu"
import { NavigationMenuItems } from "./NavigationMenuItems"
import { userItems, financeItems, accessibilityItems, reportItems } from "./NavigationItems"
import { Button } from "@src/components/ui/button"
import Link from "next/link"
export function MainNavigation() {
  return (
    <div className="z-50 border-b  w-full">
      <div className="flex  w-full h-16 justify-between items-center px-4  ">
        <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 mr-4 hover:opacity-80 transition-opacity"
            >
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </Link>

            <NavigationMenu className="mx-6">
              <NavigationMenuList>
                <NavigationMenuItems href="/users" trigger="Users" items={userItems} />
                <NavigationMenuItems href="/finance" trigger="Finance" items={financeItems} />
                <NavigationMenuItems href="/accessibility" trigger="Accessibility" items={accessibilityItems} />
                <NavigationMenuItems href="/reports" trigger="Reports" items={reportItems} />
              </NavigationMenuList>
            </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">JD</span>
          </div>
        </div>
      </div>
    </div>
  )
}