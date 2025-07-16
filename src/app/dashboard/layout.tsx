"use client";
import {getUserProfile} from '@/api/user';
import { useDispatch } from 'react-redux';
import {setUser} from '@/slice/userSlice';
import { useRouter } from 'next/navigation';
import { useEffect ,useState} from 'react';
 



export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {



   const [isLoading, setIsLoading] = useState(true)
  const dispatch=useDispatch();
  const router=useRouter();

 async function getUser(){
  try{

    const response=await getUserProfile();
    
    if(response.status===200){
      console.log(response.data.user);
      dispatch(setUser(response.data.user));
      if(!response.data.profile_completed){
        router.push("/dashboard/profile");
      }
    }
    

  }catch(error){

    console.log("Something went wrong ", error);
  } finally{
    setIsLoading(false);
  } 

  }

  useEffect(()=>{
     getUser();
  },[]);

    if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
   <div>
       <main>{children}</main>

   </div>
  
  )
}