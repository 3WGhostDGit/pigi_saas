'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  Users,
  Settings,
  ShieldCheck,
  Briefcase,
  Code,
  Building,
  DollarSign,
  Monitor,
  type LucideIcon // Import the type
} from 'lucide-react';
import Link from 'next/link';
import { SignOutButton } from '@/components/auth/SignOutButton';
import type { NavLink as NavLinkType } from './SidebarNav';

// Define the links using icon names (strings)
const navLinks: Array<Pick<NavLinkType, 'title' | 'href'> & { icon: string }> = [
  { title: "Admin", href: "/admin", icon: "ShieldCheck" },
  { title: "RH", href: "/rh", icon: "Users" },
  { title: "Finance", href: "/fin", icon: "DollarSign" },
  { title: "IT Support", href: "/it-support", icon: "Monitor" },
  { title: "Développement", href: "/dev", icon: "Code" },
  { title: "Technologie", href: "/tech", icon: "Briefcase" },
  { title: "Direction", href: "/dg", icon: "Building" },
];

// Explicit mapping from icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Home,
  Users,
  Settings,
  ShieldCheck,
  Briefcase,
  Code,
  Building,
  DollarSign,
  Monitor
};

export function MobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-4 flex flex-col">
        <div className="mb-4">
          <Link href="/" className="font-bold text-lg" onClick={() => setIsOpen(false)}>
            PIGI
          </Link>
        </div>
        <nav className="flex-grow flex flex-col space-y-1">
          {navLinks.map((item) => {
            const IconComponent = iconMap[item.icon]; // Look up icon
            if (!IconComponent) return null; // Skip if icon not found
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <IconComponent className="h-4 w-4" /> {/* Render icon */}
                {item.title}
              </Link>
            )}
          )}
        </nav>
        <div className="mt-auto border-t pt-4">
          <SignOutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}