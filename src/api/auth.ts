
import axios from "@/lib/axiosInstance";
interface userSignUpData{
    email:string,
    username:string,
    password:string,
    token?:string,
    recaptchaToken?:string
}

interface userLoginData{

      username_or_email:string,
      password:string,

}

interface logInWithSocialData{
     idToken:string,
     token?:string,
}


export async function signUp(userData:userSignUpData){

    try{
        const response = await axios.post('/auth/signup', userData);
        return response;

    }catch(error:any){
        console.error("Error during sign up:", error);
        return error.response;
    }

     
}


export async function logInWithSocial(userData:logInWithSocialData){
    try{
        const response = await axios.post(`/auth/login?token=${userData.token}`, userData);
        return response;
    }catch(error:any){
        console.error("Error during log in:", error);
        return error.response;
    }
  
}

export async function logIn(userData:userLoginData){
    try{
        const response = await axios.post('/auth/login-password', userData);
        return response;
    }catch(error:any){
        console.error("Error during log in:", error);
        return error.response;
    }
  
}
