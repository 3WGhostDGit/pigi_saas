'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { User, LogOut as LogOutIcon, Search, Settings, UserCircle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// RH-Specific Header: No title, subtle shadow, cleaner spacing
export function RHHeader({ className }: { className?: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? '?';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (!user) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Header container: remove sticky, add shadow-sm, adjust padding */}
      <header className={cn("flex h-16 items-center gap-4 bg-background px-4 md:px-6 shadow-sm z-10", className)}>
        {/* Right-aligned items: Search, Theme, User Menu */}
        {/* Adjusted gap for potentially better spacing */}
        <div className="flex w-full items-center justify-end gap-3 md:gap-5">
          {/* Search Bar - ensure icon is present */}
          <form className="relative ml-auto flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search within RH..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] h-9 rounded-md"
            />
          </form>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-9 w-9 flex items-center justify-center">
                <ThemeToggle />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Theme</p>
            </TooltipContent>
          </Tooltip>

          {/* User Menu Dropdown */}
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Ensure ghost variant and consistent size */}
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? 'User'}
                      />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/rh/profile" className="w-full">
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/rh/profile/edit" className="w-full">
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/rh/profile/settings" className="w-full">
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
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
      </header>
    </TooltipProvider>
  );
}
