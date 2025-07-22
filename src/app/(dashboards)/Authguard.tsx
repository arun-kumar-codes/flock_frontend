"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/slice/userSlice";
import { getUserProfile } from "@/api/user";
import Loader from "@/components/Loader";
import { roleRoutes } from "@/constants/roleRoutes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const initAuth = async () => {
      try {
        let currentUser = user;

        if (!user?.role?.trim()) {
          const response = await getUserProfile();
          if (response.status === 200) {
            currentUser = response.data.user;
            dispatch(setUser({ ...currentUser, is_profile_completed: response.data.profile_complete }));
          } else {
            router.replace("/login");
            return;
          }
        }

        const role = currentUser.role.toLowerCase() as keyof typeof roleRoutes;
        const allowedRoutes = roleRoutes[role] || [];
        const isAllowed = allowedRoutes.some((route: string) => pathname.startsWith(route));

        if (!isAllowed) {
          // Redirect to the role's home route
          router.replace(allowedRoutes[0] || "/login");
        }

      } catch (error) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname]);

  return loading ? <Loader /> : <>{children}</>;
}
