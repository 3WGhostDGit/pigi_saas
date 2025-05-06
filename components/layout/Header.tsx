'use client'; // Header needs client-side interaction for dropdown/sheet

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User, LogOut as LogOutIcon } from 'lucide-react'; // Use specific name for LogOut icon
import { useSession, signOut } from 'next-auth/react';
import { MobileSidebar } from '@/components/layout/MobileSidebar'; // Use alias path
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Import ThemeToggle

export function Header() {
  const { data: session } = useSession(); // Get session data on client
  const user = session?.user;
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?'; // Fallback initial

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // If session is somehow still loading or null (shouldn't happen here), render minimally or null
  if (!user) {
    // Optional: Render a loading state or null
    // console.warn("Header rendered without user session in dashboard context!");
    return null; // Or a loading skeleton
  }

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        {/* Use container for padding, max-width can be adjusted */}
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          
          {/* Left side: Mobile Menu Trigger and Site Name */}
          <div className="flex gap-6 md:gap-10 items-center"> {/* Ensure vertical alignment */}
            <div className="md:hidden">
              <MobileSidebar />
            </div>
            <Link href="/" className="flex items-center space-x-2">
              {/* <YourLogo className="h-6 w-6" /> */} 
              <span className="inline-block font-bold text-lg">PIGI</span> {/* Slightly larger font */}
            </Link>
            {/* Optional: Add main desktop nav links here if needed later */}
          </div>

          {/* Right side: Search, Theme Toggle, User Menu */}
          <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2 md:space-x-4"> {/* Reduced gap slightly for tighter feel */}
            {/* Search Bar - Consider making it expandable or modal on smaller screens */}
            <div className="w-full flex-1 md:w-auto md:flex-none">
               <Input
                type="search"
                placeholder="Search..."
                className="md:w-[200px] lg:w-[300px] h-9" // Consistent height
              />
            </div>
            
            {/* Theme Toggle with Tooltip */} 
            <Tooltip>
              <TooltipTrigger asChild>
                <div> {/* Wrap ThemeToggle for Tooltip trigger if it's not a direct button */}
                    <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>         

            {/* User Menu Dropdown with Tooltip */} 
            <Tooltip>
              <TooltipTrigger asChild>
                {/* DropdownMenu already contains a Button trigger, so Tooltip can wrap it directly */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full" // Consistent height
                    >
                      <Avatar className="h-9 w-9"> {/* Consistent height */}                
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User'} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem disabled> {/* Add links later */}
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      {/* Add more items like Settings if needed */}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Account</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
} 