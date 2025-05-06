import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from '@/components/auth/SignOutButton';

// This layout now becomes an async Server Component
export default async function DgLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/dg');
  }

  // 2. Check if the user belongs to the 'Direction Générale' department
  if (session.user.department?.toLowerCase() !== 'direction générale') {
    console.warn(`User ${session.user.email} (Dept: ${session.user.department}) is not authorized for DG dashboard. Redirecting to home.`);
    redirect('/');
  }

  // If checks pass, render the layout and children
  return (
    <section className="flex h-screen">
      {/* Example: Add a sidebar specific to DG */}
      <aside className="w-64 bg-red-100 p-4 dark:bg-red-900 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">DG Menu</h2>
        <ul className="flex-grow">
          <li>Company Overview</li>
          <li>Strategic Planning</li>
        </ul>
        <SignOutButton />
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </section>
  );
} 