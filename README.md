# PIGI SaaS Platform

<div align="center">
  <img src="public/hoxi.jpeg" alt="PIGI Logo" width="200"/>
  <h3>A comprehensive enterprise management solution</h3>
</div>

PIGI is a modern, full-featured SaaS platform built with Next.js 15, providing integrated modules for Human Resources, Finance, IT Support, Development, and Executive Management. The platform features a sleek, responsive UI built with Shadcn UI components and follows best practices for enterprise application development.

## ✨ Features

- **Multi-Department Dashboard System**
  - Specialized dashboards for HR, Finance, IT, Development, and Executive teams
  - Role-based access control with fine-grained permissions
  - Responsive design that works on desktop, tablet, and mobile devices

- **Human Resources Module**
  - Complete employee management system
  - Leave management with approval workflows
  - Performance reviews and tracking
  - Training and development programs
  - Benefits administration
  - Document management
  - Recruitment tools

- **Modern Authentication**
  - Secure authentication with NextAuth.js
  - JWT-based sessions
  - Role-based access control
  - Department-specific redirects after login

- **Premium UI/UX**
  - Built with Shadcn UI components
  - Radix UI for accessible popups and dialogs
  - Dark and light mode with theme customization
  - Skeleton loaders for improved perceived performance
  - Toast notifications with Sonner
  - Responsive tables with sorting, filtering, and pagination

## 🛠️ Technology Stack

- **Frontend**
  - Next.js 15 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Radix UI
  - Lucide React Icons

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - MySQL Database
  - NextAuth.js for authentication

- **Development Tools**
  - PNPM for package management
  - ESLint for code quality
  - Multi-agent AI tools for development assistance

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- PNPM package manager
- MySQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/3WGhostDGit/pigi_saas.git
   cd pigi_saas
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your database credentials and NextAuth secret.

4. Set up the database:
   ```bash
   npx prisma db push
   mysql -u root pigi_db < mock_data.sql
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📸 Screenshots

<div align="center">
  <p>Welcome Page</p>
  <img src="public/screenshots/welcome.png" alt="Welcome Page" width="80%"/>

  <p>HR Dashboard</p>
  <img src="public/screenshots/hr-dashboard.png" alt="HR Dashboard" width="80%"/>

  <p>Employee Management</p>
  <img src="public/screenshots/employees.png" alt="Employee Management" width="80%"/>
</div>

## 🔒 Authentication

The application uses NextAuth.js for authentication with a credentials provider. Default login credentials from the mock data:

- **Email**: admin@example.com
- **Password**: password123

## 🧩 Project Structure

```
pigi_saas/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication pages
│   ├── (dashboards)/     # Department-specific dashboards
│   ├── api/              # API routes
│   └── ...
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components (Shadcn)
│   └── ...
├── lib/                  # Utility functions and shared code
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [Lucide Icons](https://lucide.dev/)
