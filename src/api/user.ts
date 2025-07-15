import axiosInstance from "@/lib/axiosInstance";


export async function getUserProfile() {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response;
  } catch (error:any) {
    console.error("Error fetching user profile:", error);
    return error.response;
  }
}