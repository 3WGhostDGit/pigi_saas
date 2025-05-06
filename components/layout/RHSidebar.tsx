'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SidebarNav, NavLink } from '@/components/layout/SidebarNav'; // Assuming SidebarNav exists
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LayoutDashboard, // Dashboard
    Users,           // Employees
    CalendarClock,   // Leave Management
    Banknote,        // Payroll / Compensation (alternative to DollarSign)
    TrendingUp,      // Performance
    GraduationCap,   // Training & Development
    Gift,            // Benefits (alternative to HeartHandshake/ShieldCheck)
    FolderArchive,   // Documents
    Briefcase,       // Recruitment (Kept from original)
    Building2,       // Organization / Departments
    SlidersHorizontal, // Settings (alternative to Settings icon)
    ChevronsUpDown,  // Header toggle icon
    // --- Choose ONE icon for the main portal header ---
    Building,        // Example: Generic Building Icon for RH Portal
    // PanelLeft,    // Original Placeholder
} from 'lucide-react';

// --- RH Navigation Links based on Schema & Common HR Functions ---
const rhNavLinks: NavLink[] = [
  { title: 'RH Dashboard', href: '/rh', icon: LayoutDashboard },
  { title: 'Employees', href: '/rh/employees', icon: Users },
  { title: 'Leave Management', href: '/rh/leave', icon: CalendarClock },
  { title: 'Payroll', href: '/rh/payroll', icon: Banknote }, // Or DollarSign
  { title: 'Performance', href: '/rh/performance', icon: TrendingUp },
  { title: 'Training & Dev', href: '/rh/training', icon: GraduationCap }, // Shortened title
  { title: 'Benefits', href: '/rh/benefits', icon: Gift },
  { title: 'Documents', href: '/rh/documents', icon: FolderArchive },
  { title: 'Recruitment', href: '/rh/recruitment', icon: Briefcase }, // Kept as standard function
  { title: 'Organization', href: '/rh/organization', icon: Building2 },
  { title: 'Settings', href: '/rh/settings', icon: SlidersHorizontal }, // Or Settings
];
// ---------

interface RHSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

// NOTE: Only showing the updated parts of the component for brevity
// Keep the surrounding structure from the previous good version.

export function RHSidebar({ className, isCollapsed = false }: RHSidebarProps) {
  return (
    // Keep the outer div structure with width, transitions, shadow etc.
    <div
      className={cn(
        'hidden md:block bg-background border-r shadow-md h-full',
        isCollapsed ? 'w-[72px]' : 'w-64',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      <div className="flex h-full max-h-screen flex-col">

        {/* 1. Sidebar Header Section - Updated Icon & Text */}
        <div
          className={cn(
            'flex items-center border-b',
            'h-[60px]',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          <Link
            href="/rh" // Link specifically to RH dashboard
            className={cn(
              'flex items-center gap-2 font-semibold text-lg whitespace-nowrap overflow-hidden',
               isCollapsed ? 'w-0': ''
            )}
          >
             {/* --- Use an icon representing HR/Building --- */}
             <Building className="h-6 w-6 flex-shrink-0" />
             <span className={cn('transition-opacity duration-300', isCollapsed ? 'opacity-0' : 'opacity-100 delay-200')}>
               RH Portal {/* Updated Text */}
             </span>
          </Link>

          <ChevronsUpDown
              className={cn(
                'h-5 w-5 text-muted-foreground flex-shrink-0',
                isCollapsed ? 'hidden' : ''
              )}
            />
        </div>

        {/* 2. Navigation Section - Updated Label & Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <TooltipProvider delayDuration={0}>
            <div className={cn('flex flex-col gap-1', isCollapsed ? 'px-2' : 'px-4')}>
              {/* Group Label - Updated */}
              {!isCollapsed && (
                <div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  HR Management {/* Updated Label */}
                </div>
              )}

              {/* Use SidebarNav component with the NEW rhNavLinks */}
              <SidebarNav
                links={rhNavLinks} // <-- Use the new HR-specific links
                isCollapsed={isCollapsed}
                // currentPath={pathname} // Pass current path if needed
              />
            </div>
          </TooltipProvider>
        </div>

        {/* 3. Footer Section - Upgrade Card (Keep or Remove as needed) */}
        {/* Content remains the same unless you want to change the text */}
        <div className={cn(
            "mt-auto transition-opacity duration-300",
            isCollapsed ? 'opacity-0 h-0 overflow-hidden p-0' : 'opacity-100 p-4'
           )}
        >
           <Card className="bg-muted/50 dark:bg-muted/20 border-none">
             <CardHeader className="p-3 pt-3">
               {/* You might want to adjust title/description if keeping this card */}
               <CardTitle className="text-sm font-semibold">Upgrade Plan</CardTitle>
               <CardDescription className="text-xs leading-tight mt-1">
                 Unlock advanced HR features and reporting.
               </CardDescription>
             </CardHeader>
             <CardContent className="p-3 pt-1">
               <Button size="sm" className="w-full h-8 text-xs">
                 Explore Plans {/* Example button text change */}
               </Button>
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}