import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Convert to async Server Component
export default async function WelcomePage() {
  const session = await getServerSession(authOptions);

  // If user is logged in, determine where to redirect based on their role/department
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

  // If no session, show the welcome page content
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
          <div className="flex flex-col items-start space-y-6">
            {/* Optional Top Badge (like 70% off) */}
            {/* <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground shadow-sm">
              70% Off for first 3 months
            </div> */}

            {/* Main Heading (Restored Original Text) */}
            <h2 className="text-2xl font-semibold text-primary">Hey, Bienvenue</h2>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              PIGI
            </h1>

            {/* Sub-heading / Description (Restored Original Text) */}
            <p className="text-lg leading-relaxed text-muted-foreground">
              Votre plateforme centralisée pour [décrivez brièvement ce que fait PIGI].
              Connectez-vous ou créez un compte pour commencer.
            </p>

            {/* Call-to-Action Buttons (Reused & Styled) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3">
                <Link href="/login">
                  Se Connecter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {/* Secondary Button/Link Style */}
              <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto border-1 rounded-full border text-muted-foreground hover:text-foreground">
                <Link href="/register">
                  Créer un Compte
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side illustration Placeholder - Replaced with Image */}
          <div className="relative ">

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