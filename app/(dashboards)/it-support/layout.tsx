import { ReactNode } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from '@/components/auth/SignOutButton';

// This layout now becomes an async Server Component
export default async function ItSupportLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session?.user) {
    // Redirect to login page if not authenticated
    redirect('/login?callbackUrl=/it-support'); // Optional: Redirect back here after login
  }

  // 2. Check if the user belongs to the 'Opérations IT' department
  // Check case-insensitively against the actual department name from DB
  if (session.user.department?.toLowerCase() !== 'opérations it') {
    // Option 1: Redirect to home page
    console.warn(`User ${session.user.email} (Dept: ${session.user.department}) is not authorized for IT Support dashboard. Redirecting to home.`);
    redirect('/'); // Redirect to home page instead of /dashboard

    // Option 2: Show an access denied message
    // return (
    //   <div>
    //     <h1>Access Denied</h1>
    //     <p>You do not have permission to access the IT Support dashboard.</p>
    //   </div>
    // );
  }

  // If checks pass, render the layout and children
  return (
    <div className="flex h-screen">
      {/* Example: Add a sidebar specific to IT Support */}
      <aside className="w-64 bg-gray-100 p-4 dark:bg-gray-800 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">IT Support Menu</h2>
        <ul className="flex-grow">
          <li>Tickets</li>
          <li>Knowledge Base</li>
          {/* Add more IT-specific links */}
        </ul>
        <SignOutButton />
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 