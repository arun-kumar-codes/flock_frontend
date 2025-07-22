import axiosInstance from "@/lib/axiosInstance";

export async function createBlog(data: any) {

    try{
        const response = await axiosInstance.post('/blog/create', data,{
          headers:{
            "Content-Type": "multipart/form-data"
          }
        });
        return response;

    }catch(error:any){
        console.error("Error during sign up:", error);
        return error.response;
    }
}

export async function getMyBlog() {
  try {
    const response = await axiosInstance.get(`/blog/my-blogs`);
    return response;
  } catch (error:any) {
    console.error("Error fetching blog by ID:", error);
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

export async function getBlogByStatus(status: any) {
  try {
    const response = await axiosInstance.get(`/blog/get-all?status=${status}`);
    return response;
  } catch (error:any) {
    console.error("Error fetching blog by ID:", error);
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

export async function updateBlog(blogId: any, data: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response;
  } catch (error:any) {
    console.error("Error updating blog:", error);
    return error.response;
  }
}

export async function sendForApproval(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/send-for-approval`);
    return response;
  } catch (error:any) {
    console.error("Error sending blog for approval:", error);
    return error.response;
  }
}

export async function approveBlog(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/approve`);
    return response;
  } catch (error:any) {
    console.error("Error approving blog:", error);
    return error.response;
  }
}

export async function rejectBlog(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/reject`);
    return response;
  } catch (error:any) {
    console.error("Error approving blog:", error);
    return error.response;
  }
}


export async function archiveBlog(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/archive`);
    return response;
  } catch (error:any) {
    console.error("Error approving blog:", error);
    return error.response;
  }
}


export async function unarchiveBlog(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/unarchive`);
    return response;
  } catch (error:any) {
    console.error("Error approving blog:", error);
    return error.response;
  }
}


export async function updateBlogById(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}`);
    return response;
  } catch (error:any) {
    console.error("Error fetching blog by ID:", error);
    return error.response;
  }
}
