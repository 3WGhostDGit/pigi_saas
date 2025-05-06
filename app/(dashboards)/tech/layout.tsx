import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from '@/components/auth/SignOutButton';

// This layout now becomes an async Server Component
export default async function TechLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/tech');
  }

  // 2. Check if the user belongs to the 'Technologie' department
  // Note: This might include users from sub-departments like Dev and Ops.
  // Adjust logic if you only want users directly in 'Technologie'.
  if (session.user.department?.toLowerCase() !== 'technologie') {
    console.warn(`User ${session.user.email} (Dept: ${session.user.department}) is not authorized for Tech dashboard. Redirecting to home.`);
    redirect('/');
  }

  // If checks pass, render the layout and children
  return (
    <section className="flex h-screen">
      {/* Example: Add a sidebar specific to Tech */}
      <aside className="w-64 bg-purple-100 p-4 dark:bg-purple-900 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Tech Menu</h2>
        <ul className="flex-grow">
          <li>Infrastructure</li>
          <li>Security</li>
          <li>Overview</li>
        </ul>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </section>
  );
} 