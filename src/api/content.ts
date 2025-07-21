import axiosInstance from "@/lib/axiosInstance";

export async function createBlog(data: any) {

    try{
        const response = await axiosInstance.post('/blog/create', data);
        return response;

    }catch(error:any){
        console.error("Error during sign up:", error);
        return error.response;
    }
}


export async function getBlog() {
  try {
    const response = await axiosInstance.get('/blog/get-all');
    return response;
  } catch (error:any) {
    console.error("Error fetching user profile:", error);
    return error.response;
  }
}


export async function deleteBlog(blogId:any) {
  try {
    const response = await axiosInstance.delete(`/blog/delete/${blogId}`);
    return response;
  } catch (error:any) {
    console.error("Error deleting blog:", error);
    return error.response;
  }
}