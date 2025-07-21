// components/AuthGuard.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch,useSelector } from "react-redux";
import { setUser } from "@/slice/userSlice";
import { getUserProfile } from "@/api/user";
import Loader from "@/components/Loader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
   const user=useSelector((state:any)=>state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

   

    if(!user||!user.role.trim()){

      getUserProfile()
        .then((response) => {
          if (response.status === 200) {
            const user = response.data.user;
            dispatch(setUser({ ...user, is_profile_completed: response.data.profile_complete }));

          const role = user.role.toLowerCase();
          if (role === "admin") router.replace("/admin");
          else if (role === "viewer") router.replace("/viewer");
          else if (role === "creator") router.replace("/dashboard");
          else router.replace("/login");
          } else {
            router.replace("/login");
          }
        })
        .catch(() => {
          router.replace("/login");
        })
        .finally(() => setLoading(false));
    }

       

  }, []);

  return loading ? <Loader /> : <>{children}</>;
}
