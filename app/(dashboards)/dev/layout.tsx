import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from '@/components/auth/SignOutButton';

// This layout now becomes an async Server Component
export default async function DevLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/dev');
  }

  // 2. Check if the user belongs to the 'Développement Logiciel' department
  if (session.user.department?.toLowerCase() !== 'développement logiciel') {
    console.warn(`User ${session.user.email} (Dept: ${session.user.department}) is not authorized for Dev dashboard. Redirecting to home.`);
    redirect('/');
  }

  // If checks pass, render the layout and children
  return (
    <section className="flex h-screen"> {/* Added flex h-screen for structure */}
      {/* Example: Add a sidebar specific to Dev */}
      <aside className="w-64 bg-green-100 p-4 dark:bg-green-900 flex flex-col"> {/* Added flex flex-col */}
        <h2 className="text-lg font-semibold mb-4">Dev Menu</h2>
        <ul className="flex-grow"> {/* Added flex-grow */}      
          <li>Projects</li>
          <li>Tasks</li>
          <li>Code Reviews</li>
        </ul>
        {/* Add SignOutButton at the bottom */}
        <SignOutButton /> 
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </section>
  );
}