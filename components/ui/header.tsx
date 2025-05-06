"use client";


import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <div className="flex">

    </div>
  );
} 