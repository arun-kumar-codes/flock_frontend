"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/slice/userSlice";
import { getUserProfile } from "@/api/user";
import Loader from "@/components/Loader2";
import { roleRoutes } from "@/constants/roleRoutes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // 1️⃣ No token → allow all /viewer routes, redirect others to /viewer
    if (!token) {
      if (!pathname.startsWith("/viewer")) {
        router.replace("/viewer");
      }
      setLoading(false);
      // //console.log("AUth guard");
      return;
    }

    // 2️⃣ Token present → use existing role-based auth
    const initAuth = async () => {
      try {
        let currentUser = user;

        if (!user?.role?.trim()) {
          const response = await getUserProfile();
          if (response.status === 200) {
            currentUser = response.data.user;
            dispatch(
              setUser({
                ...currentUser,
                is_profile_completed: response.data.profile_complete,
              })
            );
          } else {
            router.replace("/viewer");
            return;
          }
        }

        const role = currentUser.role.toLowerCase() as keyof typeof roleRoutes;
        const allowedRoutes = roleRoutes[role] || [];
        const isAllowed = allowedRoutes.some((route: string) =>
          pathname.startsWith(route)
        );

        if (!isAllowed) {
          router.replace(allowedRoutes[0] || "/viewer");
        }
      } catch (error) {
        router.replace("/viewer");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname]);

  return loading ? <Loader /> : <>{children}</>;
}
