import { Session } from "next-auth";

// Fonction simple pour vérifier si l'utilisateur a au moins un des rôles requis
export function hasRole(session: Session | null, requiredRoles: string | string[]): boolean {
  if (!session?.user?.roles) {
    return false;
  }

  const userRoles = session.user.roles;
  const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return rolesToCheck.some(role => userRoles.includes(role));
}

// Exemple de fonction plus avancée (à développer si besoin)
// export async function hasPermission(session: Session | null, requiredPermission: { action: string; subject: string }): Promise<boolean> {
//   if (!session?.user?.id) {
//     return false;
//   }
//   // Logique pour récupérer les permissions de l'utilisateur depuis la DB (via ses rôles)
//   // et vérifier si la permission requise est présente
//   // const userPermissions = await fetchUserPermissions(session.user.id);
//   // return userPermissions.some(p => p.action === requiredPermission.action && p.subject === requiredPermission.subject);
//   return false; // Placeholder
// } 