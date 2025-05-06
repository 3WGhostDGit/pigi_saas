'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type LucideIcon } from 'lucide-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: LucideIcon // Use the actual icon component
}

interface SidebarNavProps {
  isCollapsed: boolean
  links: NavLink[]
}

export function SidebarNav({ links, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const IconComponent = link.icon;
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: pathname === link.href ? "default" : "ghost", size: "icon" }),
                    "h-9 w-9",
                    pathname === link.href &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                 {link.title}
                 {link.label && (
                   <span className="ml-auto text-muted-foreground">
                     {link.label}
                   </span>
                 )}
               </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: pathname === link.href ? "default" : "ghost", size: "sm" }),
                pathname === link.href &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    pathname === link.href && "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}