import { ReactNode, Suspense } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RHHeader } from '@/components/layout/RHHeader';
import { RHSidebar } from '@/components/layout/RHSidebar';
import { Metadata } from 'next';
import Loading from '@/app/loading'; // Assuming you have a Loading component

export const metadata: Metadata = {
  title: 'RH Dashboard',
  description: 'Manage Human Resources',
};

// This layout now becomes an async Server Component
export default async function RhLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/rh');
  }

  // 2. Check if the user belongs to the 'RH' department (case-insensitive check)
  if (session.user.department?.toLowerCase() !== 'ressources humaines') {
    console.warn(`User ${session.user.email} (Dept: ${session.user.department}) is not authorized for RH dashboard. Redirecting to home.`);
    redirect('/');
  }

  // If checks pass, render the layout and children
  return (
    // Define the grid structure for the entire screen
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      {/* Sidebar: Use md:sticky instead of fixed for better grid integration */}
      {/* Define width directly, removed max-w-xs */}
      <RHSidebar className="hidden md:sticky md:top-0 md:block h-screen w-[260px]" />

      {/* Main content area (Header + Children) */}
      {/* Removed md:ml-[25%] - Grid handles positioning */}
      <div className="flex flex-col">
        {/* Header: Make sticky within its column */}
        <RHHeader className="sticky top-0 z-10" />
        {/* Main content with padding and overflow */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}