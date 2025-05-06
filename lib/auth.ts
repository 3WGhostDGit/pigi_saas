import NextAuth, { type NextAuthOptions, type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// Define the PrismaUser type including Department
type PrismaUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  hashedPassword?: string | null;
  createdAt: Date;
  updatedAt: Date;
  departmentId?: string | null;
  department?: { // Add related department object
    id: string;
    name: string;
  } | null;
  jobTitle?: string | null;
  managerId?: string | null;
  entryDate?: Date | null;
  roles: any[]; // Keep as any for now, but could be typed better
};

// Étendre le type Session et JWT pour inclure nos champs personnalisés
declare module "next-auth" {
  interface Session {
    user: NextAuthUser & {
      id: string;
      roles?: string[]; // Tableau des noms de rôles
      department?: string | null; // Add department name
      // permissions?: string[]; // Ou tableau des permissions si vous préférez
    };
  }
  interface User extends PrismaUser {
    roles?: string[];
    department?: string | null; // Use department name string here
    // permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles?: string[];
    department?: string | null; // Add department name
    // permissions?: string[];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john.doe@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Credentials manquants");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { // Inclure les rôles ET le département
            roles: { include: { role: true } },
            department: true // Include the related department
          }
        });

        if (!user || !user.hashedPassword) {
          console.log("Utilisateur non trouvé ou pas de mot de passe défini");
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValidPassword) {
          console.log("Mot de passe invalide");
          return null;
        }
        
        console.log("Authentification réussie pour:", user.email);
        
        // Préparer l'objet utilisateur à retourner (sans mot de passe, avec les noms de rôles)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashedPassword, roles, department, ...userWithoutPassword } = user;
        const roleNames = user.roles.map((userRole: any) => userRole.role.name);
        const departmentName = user.department?.name ?? null; // Get department name safely
        
        return { ...userWithoutPassword, roles: roleNames, department: departmentName }; // Return user with department name
      },
    }),
    // Ajoutez d'autres providers ici si nécessaire (Google, GitHub, etc.)
  ],
  session: {
    strategy: "jwt", // Utilisation de JWT pour la session
  },
  secret: process.env.NEXTAUTH_SECRET, // Doit être défini dans .env
  pages: {
    signIn: '/login', // Page de connexion personnalisée (à créer)
    // error: '/auth/error', // Page d'erreur d'authentification (optionnel)
    // signOut: '/auth/signout',
  },
  callbacks: {
    // Pour inclure l'ID utilisateur et d'autres infos dans le JWT
    async jwt({ token, user }) {
      // user est disponible uniquement lors de la première connexion
      if (user) {
        token.id = user.id;
        token.roles = user.roles; // Les rôles sont déjà dans l'objet user retourné par authorize
        token.department = user.department; // Add department from user object
        // Alternativement, récupérer les permissions ici si nécessaire
        // const permissions = await getPermissionsForUser(user.id);
        // token.permissions = permissions;
      }
      return token;
    },
    // Pour inclure l'ID utilisateur et les autres infos du JWT dans la session client
    async session({ session, token }) {
      // Ajouter les informations du token à la session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles;
        session.user.department = token.department; // Add department from token
        // session.user.permissions = token.permissions;
      }
      return session;
    },
    // Add redirect callback for department-based routing
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url

      // Default redirect for users without specific department logic or after actions like sign out
      // Redirect logged-in users based on department ONLY if coming from sign in page
      // We need to access the user object here, which is not directly available in `redirect`.
      // A common workaround is to rely on the session state available on the client-side
      // or modify the sign-in process to pass department info.
      // For now, let's keep the default redirect logic.
      // We will handle the department redirection on the client side after login,
      // for example in the main layout or a dedicated loading page.
      return baseUrl // Default redirect to home page
    },
  },
};

export default NextAuth(authOptions); 