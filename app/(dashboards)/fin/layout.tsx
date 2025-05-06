import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from '@/components/auth/SignOutButton';

// This layout now becomes an async Server Component
export default async function FinLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/fin');
  }

  // 2. Check if the user belongs to the 'Finance' department
  if (session.user.department?.toLowerCase() !== 'finance') {
    console.warn(`User ${session.user.email} (Dept: ${session.user.department}) is not authorized for Finance dashboard. Redirecting to home.`);
    redirect('/');
  }

  // If checks pass, render the layout and children
  return (
    <section className="flex h-screen">
      {/* Example: Add a sidebar specific to Finance */}
      <aside className="w-64 bg-yellow-100 p-4 dark:bg-yellow-900 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Finance Menu</h2>
        <ul className="flex-grow">
          <li>Reports</li>
          <li>Budgets</li>
          <li>Expenses</li>
        </ul>
        <SignOutButton />
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </section>
  );
} 