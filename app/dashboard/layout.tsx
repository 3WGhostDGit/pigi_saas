import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// This layout becomes an async Server Component
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // If checks pass, render the layout and children
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
