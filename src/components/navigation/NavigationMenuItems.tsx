"use client"
// import { Link } from "react-router-dom"
import Link from "next/link"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@src/components/ui/navigation-menu"
import { cn } from "@src/lib/utils"

interface NavigationItem {
  title: string
  url: string
  icon: any
  description: string
}

interface NavigationMenuItemsProps {
  trigger: string
  items: NavigationItem[]
  href: string
}

export function NavigationMenuItems({ trigger, items, 
  // href 
}: NavigationMenuItemsProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="hover:bg-accent/50 transition-colors">
        {trigger}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 bg-white md:w-[500px] md:grid-cols-2 animate-fade-in">
          {items.map((item) => (
            <li key={item.title}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.url}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-sm font-medium leading-none">{item.title}</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1 group-hover:text-accent-foreground/70">
                    {item.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}