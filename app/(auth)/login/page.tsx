import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";


// Convert to async Server Component to check session
export default async function LoginPage() {

  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect them based on role/department
  if (session?.user) {
    const userRoles = session.user.roles || [];
    const userDepartment = session.user.department?.toLowerCase() || '';

    // Direct redirection based on role/department without going through the redirecting page
    if (userRoles.includes('ADMIN')) {
      redirect('/admin');
    } else if (userDepartment === 'ressources humaines' || userDepartment === 'human resources') {
      redirect('/rh');
    } else if (userDepartment === 'opérations it' || userDepartment === 'it operations') {
      redirect('/it-support');
    } else if (userDepartment === 'développement logiciel' || userDepartment === 'software development') {
      redirect('/dev');
    } else if (userDepartment === 'technologie' || userDepartment === 'technology') {
      redirect('/tech');
    } else if (userDepartment === 'finance') {
      redirect('/fin');
    } else if (userDepartment === 'direction générale' || userDepartment === 'general management') {
      redirect('/dg');
    } else {
      // Default fallback if no specific department/role match
      redirect('/dashboard');
    }
  }

  // If no session, show the login page content

  return (

    <div className="relative flex align-items justify-center h-dvh overflow-hidden bg-background">
      {/* Add Geometric Shapes (Positioned absolutely) */}
      <div className="absolute top-[10%] left-[5%] h-4 w-4 rounded-full bg-primary/20 animate-pulse"></div>
      <div className="absolute top-[20%] right-[10%] h-6 w-6 rounded-md bg-secondary/20 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-[15%] left-[15%] h-5 w-5 border-2 border-primary/30 rounded-sm"></div>
      <div className="absolute bottom-[25%] right-[20%] h-3 w-3 bg-muted-foreground/20 rounded-full"></div>
      {/* Simple triangle example */}
      <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} className="absolute top-[40%] left-[40%] h-5 w-5 bg-primary/10"></div>

      {/* Main Content Area (using grid for layout) */}
      <main className="container relative z-10 flex flex-grow items-center px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-24 items-center w-full">
          {/* Left side content (Text & CTAs) */}
          <div className="flex flex-col items-center space-y-3">
            <Card className="w-full max-w-md animate-fade-slide-in-up shadow-xl dark:shadow-slate-900/50">
              <CardHeader className="text-center space-y-1"> {/* Added space-y-1 for better spacing */}
                {/* Optional: Add a logo here */}
                {/* <img src="/logo-icon.svg" alt="PIGI Logo" className="w-12 h-12 mx-auto mb-2" /> */}
                <CardTitle className="text-2xl font-bold">Connexion PIGI</CardTitle>
                <CardDescription>
                  Entrez vos identifiants pour accéder à la plateforme.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
                <p className="mt-6 text-center text-sm text-muted-foreground"> {/* Use muted-foreground for theme consistency */}
                  Pas encore de compte?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:underline underline-offset-4" /* Improved underline */
                  >
                    S'inscrire
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right side illustration Placeholder - Replaced with Image */}
          <div className="relative">

            <div className="absolute w-72 h-72 md:w-72 md:h-72 -top-12 right-12 border-3 rounded-4xl" />
            <div className="absolute w-72 h-72 md:w-72 md:h-72 -top-14 right-14 border-2 rounded-4xl" />
            <div className="absolute w-72 h-72 md:w-72 md:h-72 -top-16 right-16 border-1 rounded-4xl" />

            {/* <div className="absolute w-72 h-72 -top-22 -right-2 border-1  rounded-4xl" />
              <div className="absolute w-72 h-72 -top-18 -right-6 border-1 bg-secondary rounded-4xl" /> */}

            {/* <div className="absolute w-72 h-72 -bottom-14 -left-10 border-1 bg-primary rounded-4xl" />
              <div className="absolute w-72 h-72 -bottom-16 -left-8 border-1 bg-primary rounded-4xl" /> */}


            {/*
                  Image using Next.js Image component.
                  IMPORTANT: Make sure 'how.jpeg' has been moved to the /public folder!
                */}
            <div className="absolute w-72 h-72 md:w-72 md:h-72 -top-18 right-18">

              <Image
                src="/hoxi.jpeg"
                alt="Illustration PIGI"
                fill // Use fill to cover the parent div
                className="object-contain rounded-4xl border-background border-3" // Use object-contain to show the whole image without cropping
                priority // Add priority if it's above the fold
              />
            </div>
            <div className="absolute  w-72 h-72 md:w-72 md:h-72 -bottom-20 -left-0" >
              <div className="relative w-full h-full">
                <div className="absolute w-32 h-32 md:w-32 md:h-32 -bottom-10 -left-10 border-3  rounded-4xl" />
                <div className="absolute w-32 h-32 md:w-32 md:h-32 -top-10 -right-10 border-1 bg-secondary rounded-full" />


                <Image
                  src="/how.jpeg"
                  alt="Illustration PIGI"
                  fill // Use fill to cover the parent div
                  className="object-contain rounded-4xl border-background border-3" // Use object-contain to show the whole image without cropping
                  priority // Add priority if it's above the fold
                />

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );


}