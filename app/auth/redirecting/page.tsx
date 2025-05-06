'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Assuming you use lucide-react

// Define a mapping from department names (case-insensitive) to routes
const departmentRoutes: Record<string, string> = {
  'ressources humaines': '/rh',
  'opérations it': '/it-support', // Map 'Opérations IT' to the /it-support route
  'développement logiciel': '/dev',
  'technologie': '/tech',
  'finance': '/fin',
  'direction générale': '/dg',
  // Add other departments and their routes here if needed
};

export default function RedirectingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until session is loaded
    if (status === 'loading') {
      return;
    }

    // If not authenticated, redirect to login
    if (status === 'unauthenticated' || !session?.user) {
      router.replace('/login');
      return;
    }

    const userDepartment = session.user.department?.toLowerCase() ?? ''; // Get department safely and lowercase
    const userRoles = session.user.roles ?? [];

    // --- Add Debug Logging ---
    console.log('[Redirect Debug] Raw Department:', session.user.department);
    console.log('[Redirect Debug] Lowercase Department:', userDepartment);
    console.log('[Redirect Debug] Roles:', userRoles);
    console.log('[Redirect Debug] Is Admin?:', userRoles.includes('ADMIN'));
    console.log('[Redirect Debug] Department Route Exists?:', !!departmentRoutes[userDepartment]);
    // --- End Debug Logging ---

    let redirectPath = '/'; // Default path

    // Check for ADMIN role first (higher priority)
    if (userRoles.includes('ADMIN')) {
      redirectPath = '/admin'; // Or your designated admin path
    }
    // Then, check department routes
    else if (userDepartment && departmentRoutes[userDepartment]) {
      redirectPath = departmentRoutes[userDepartment];
    }
    // Add any other role-based redirects or logic here if needed

    console.log(`Redirecting user ${session.user.email} (Dept: ${session.user.department}, Roles: ${userRoles.join(', ')}) to ${redirectPath}`);
    router.replace(redirectPath);

  }, [session, status, router]);

  // Show loading indicator while checking session and redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Loading your dashboard...</p>
    </div>
  );
} 