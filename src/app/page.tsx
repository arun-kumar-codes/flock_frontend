'use client'
// import Login from "./(auth)/login/page";

import { useRouter } from "next/navigation";

export default function Home() {

  const router=useRouter();
  router.push("/signup");
  return (
    <div className="">
        {/* <Login/> */}
    </div>
  );
} 
