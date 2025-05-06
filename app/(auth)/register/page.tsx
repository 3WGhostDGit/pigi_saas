import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";


export default function RegisterPage() {
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

              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Créer un compte PIGI</CardTitle>
                <CardDescription>
                  Remplissez le formulaire pour vous inscrire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm />
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  Déjà un compte?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Se connecter
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
