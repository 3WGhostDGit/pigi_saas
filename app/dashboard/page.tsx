import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from '@/components/auth/SignOutButton';
import { LayoutDashboard, UserCircle, HelpCircle, BookOpenText, AlertTriangle, Smile, Mail, ExternalLink, Fingerprint, Building2, Users, FileEdit } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // User is logged in but doesn't have a specific department or role
  // This is a fallback dashboard

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            PIGI Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-sm">
              <span className="text-muted-foreground">Connecté: </span>
              <span className="font-semibold">{session.user.email}</span>
            </p>
<div className="w-[100px] sm:w-[120px] md:w-[140px]">
<SignOutButton />
  </div>          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4 max-w-7xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-6 w-6" />
              Bienvenue sur PIGI
            </CardTitle>
            <CardDescription>
              Plateforme Intégrée de Gestion Interne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-6"> {/* Using default variant, icon provides context */}
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Accès en attente de configuration</AlertTitle>
              <AlertDescription>
                Votre compte n'est pas encore associé à un département spécifique. Vous pouvez soumettre une demande de mise à jour de département ou contacter votre administrateur.
              </AlertDescription>
            </Alert>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default">
                <Link href="/dashboard/profile/department-request">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Demander un changement de département
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-semibold tracking-tight mb-6 mt-10">Ressources et Outils</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Profil
              </CardTitle>
              <CardDescription>Vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{session.user.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Fingerprint className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">ID Utilisateur</p>
                    <p className="font-medium text-sm">{session.user.id}</p>
                  </div>
                </div>
                {session.user.department && (
                  <div className="flex items-start">
                    <Building2 className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Département</p>
                      <p className="font-medium text-sm">{session.user.department}</p>
                    </div>
                  </div>
                )}
                {session.user.roles && session.user.roles.length > 0 && (
                  <div className="flex items-start">
                    <Users className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rôles</p>
                      <p className="font-medium text-sm">{session.user.roles.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Support
              </CardTitle>
              <CardDescription>Besoin d'aide?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Si vous avez des questions ou rencontrez des problèmes, contactez le support technique.</p>
              <Button variant="outline" className="w-full sm:w-auto">
                <Mail className="mr-2 h-4 w-4" />
                Contacter le support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenText className="h-5 w-5" />
                Documentation
              </CardTitle>
              <CardDescription>Guides et ressources</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Consultez notre documentation pour en savoir plus sur l'utilisation de PIGI.</p>
              <Button variant="outline" className="w-full sm:w-auto">
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir la documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background p-4 w-full">
        <div className="container text-center text-sm text-muted-foreground max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} PIGI - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
