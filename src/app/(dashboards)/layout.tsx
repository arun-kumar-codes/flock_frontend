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
  // const [isLoading, setIsLoading] = useState(true);
  // const dispatch = useDispatch();
  // const router = useRouter();

  // async function getUser() {
  //   try {
  //     const response = await getUserProfile();

  //     if (response.status === 200) {
  //       const user = response.data.user;
  //       dispatch(setUser({ ...user, is_profile_completed: response.data.profile_complete }));

  //       if (user.role.toLowerCase() === "admin") {
  //         router.replace("/admin");
  //         return; 
  //       }

  //       if(user.role.toLowerCase()==="viewer"){
  //         router.replace("/viewer");
  //         return;
  //       }

  //       if(user.role.toLowerCase()==="creator"){
  //         router.replace("/dashboard");
  //       }

  //       setIsLoading(false);
  //     } else {
  //       router.replace("/login");
  //     }
  //   } catch (error) {
  //     console.log("Something went wrong", error);
  //     router.replace("/login");
  //   }
  // }

  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (!token) {
  //     router.replace("/login");
  //   } else {
  //     getUser();
  //   }
  // }, []);

  // // Show loader while checking
  // if (isLoading) {
  //   return <Loader />;
  // }

  // ✅ Render only after validation is done
  return (
    <div>
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
