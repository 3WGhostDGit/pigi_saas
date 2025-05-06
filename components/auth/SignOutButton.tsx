'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const SignOutButton: React.FC = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }); // Redirect to homepage after sign out
  };

  return (
    <Button 
      variant="ghost" // Use ghost or outline for less prominence 
      size="sm" 
      onClick={handleSignOut}
      className="w-full justify-start text-left mt-auto" // Place at bottom if in sidebar
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
}; 