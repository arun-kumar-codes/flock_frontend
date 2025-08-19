'use client'
// import Login from "./(auth)/login/page";

import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from '@/slice/userSlice';
import Loader from "@/components/Loader2";
import { useSelector } from "react-redux";


export default function Home() {
  
  const dispatch = useDispatch();
  const user=useSelector((state:any)=>state.user);
  
  useEffect(() => {
    
    const detectTheme = () => {
      const savedTheme = localStorage.getItem("theme")
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)
      document.documentElement.setAttribute("data-theme", shouldBeDark ? "dark" : "light")
    }
    detectTheme()
    const theme = localStorage.getItem('theme') || 'light';
    // dispatch(setTheme(theme));
  }, []);
  const router=useRouter();
  router.push("/viewer");
  
  return (
   <Loader></Loader>
  );
} 
