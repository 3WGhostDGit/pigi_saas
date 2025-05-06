# Tech Context: PIGI SaaS Platform

## 1. Frontend

- **Framework/Library:** Next.js 15 (with App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **Icons:** Lucide React Icons
- **State Management:** (To be defined - likely React Context/Zustand or similar, if needed beyond Next.js capabilities)
- **Key Libraries:** Sonner (for toast notifications)

## 2. Backend

- **Framework:** Next.js API Routes
- **ORM:** Prisma ORM
- **Database:** MySQL
- **Authentication:** NextAuth.js (JWT-based sessions)

## 3. Development Tools

- **Package Manager:** PNPM
- **Code Quality:** ESLint
- **Development Assistance:** Multi-agent AI tools

## 4. Infrastructure & Deployment (To be defined)

- **Hosting:** (e.g., Vercel, AWS Amplify, Docker)
- **Database Hosting:** (e.g., AWS RDS, PlanetScale, self-hosted)

## 5. Version Control

- **System:** Git
- **Repository:** (e.g., GitHub, GitLab)

## 6. Key Technical Decisions from README

- Use of Next.js 15 App Router implies a server-centric approach for many components.
- Shadcn UI provides unstyled components, giving flexibility but requiring manual styling/theming via Tailwind.
- Prisma ORM for database interaction simplifies queries and migrations.
- NextAuth.js handles complex authentication flows. 