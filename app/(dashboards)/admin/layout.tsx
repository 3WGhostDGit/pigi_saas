import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from '@/components/auth/SignOutButton';

// This layout now becomes an async Server Component
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  // 2. Check if the user has the 'ADMIN' role
  const userRoles = session.user.roles ?? [];
  if (!userRoles.includes('ADMIN')) {
    console.warn(`User ${session.user.email} (Roles: ${userRoles.join(', ')}) is not authorized for Admin dashboard. Redirecting to home.`);
    redirect('/');
  }

  // If checks pass, render the layout and children
  return (
    <section className="flex h-screen">
      {/* Example: Add a sidebar specific to Admin */}      
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Admin Menu</h2>
        <ul className="flex-grow">
          <li>User Management</li>
          <li>Role Management</li>
          <li>System Settings</li>
        </ul>
        <SignOutButton />
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </section>
  );
} 