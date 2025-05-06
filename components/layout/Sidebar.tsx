import { cn } from "@/lib/utils"
import { SidebarNav, NavLink } from "./SidebarNav"
import { TooltipProvider } from "@/components/ui/tooltip"

const navLinks: Omit<NavLink, 'icon'> & { icon: string }[] = [
  { title: "Admin", href: "/admin", icon: "ShieldCheck" },
  { title: "RH", href: "/rh", icon: "Users" },
  { title: "Finance", href: "/fin", icon: "DollarSign" },
  { title: "IT Support", href: "/it-support", icon: "Monitor" },
  { title: "Développement", href: "/dev", icon: "Code" },
  { title: "Technologie", href: "/tech", icon: "Briefcase" },
  { title: "Direction", href: "/dg", icon: "Building" },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const isCollapsed = false;

  return (
    <div className={cn("hidden border-r bg-muted/40 md:block", className)}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <TooltipProvider delayDuration={0}>
            <SidebarNav links={navLinks as NavLink[]} isCollapsed={isCollapsed} /> 
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
