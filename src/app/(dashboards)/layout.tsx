"use client";
import { getUserProfile } from '@/api/user';
import { useDispatch } from 'react-redux';
import { setUser } from '@/slice/userSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
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
