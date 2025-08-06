"use client";

import AuthGuard from './Authguard';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
