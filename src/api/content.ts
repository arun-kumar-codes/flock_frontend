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

export async function getCreatorBlog(createrId: string) {
  try {
    const response = await axiosInstance.get(`/blog/get-all?creator_id=${createrId}`);
    return response;
  } catch (error:any) {
    console.error("Error fetching user profile:", error);
    return error.response;
  }
}

export async function getTrendingBlog() {
  try {
    const response = await axiosInstance.get('/blog/get-all?trending=true');
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

export async function deleteBlogByCreator(blogId:any) {
  try {
    const response = await axiosInstance.delete(`/blog/${blogId}/delete`);
    return response;
  } catch (error:any) {
    console.error("Error deleting blog:", error);
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


export async function sendForPublish(blogId: any) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/publish`);
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

export async function rejectBlog(blogId: any,reason:string) {
  try {
    const response = await axiosInstance.patch(`/blog/${blogId}/reject`,{reason});
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

export async function viewBLog(blogId: any) {
  try{

    const response = await axiosInstance.post(`/blog/${blogId}/view`);
    return response;
  }
  catch(error:any){
    console.error("Error adding view:", error);
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


export async function toggleBlogLike(blogId: any) {
  try {
    const response = await axiosInstance.post(`/blog/${blogId}/toggle-like`);
    return response;
  } catch (error:any) {
    console.error("Error toggling blog like:", error);
    return error.response;
  }
}

export async function addComment(blogId: any, comment: string) {
  try {
    const response = await axiosInstance.post(`/blog/${blogId}/comment`, { comment });
    return response;
  } catch (error:any) {
    console.error("Error fetching blog by ID:", error);
    return error.response;
  }
}

export async function editComments(blogId: any,comment:string) {
  try {
    const response = await axiosInstance.patch(`/blog/comment/${blogId}`, { comment });
    return response;
  } catch (error:any) {
    console.error("Error fetching comments:", error);
    return error.response;
  }
}

export async function deleteComment( commentId: any) {
  try {
    const response = await axiosInstance.delete(`/blog/comment/${commentId}`);
    return response;
  } catch (error:any) {
    console.error("Error deleting comment:", error);
    return error.response;
  }
}


export async function  getDashboardContent(creatorId?:string|undefined) {
  try {
    const response = await axiosInstance.get(`/content/dashboard${creatorId?`?creator_id=${creatorId}`:""}`);
    return response;
  } catch (error:any) {
    console.error("Error deleting comment:", error);
    return error.response;
  }
}


export async function createVideo(data: any) {
  try {
    const response = await axiosInstance.post('/video/create', data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response;
  } catch (error:any) {
    console.error("Error uploading video:", error);
    return error.response;
  }
}

export async function updateVideo(videoId:any, data: any) {
  try {
    const response = await axiosInstance.patch(`/video/${videoId}`,data);
    return response;
  } catch (error:any) {
    console.error("Error fetching videos:", error);
    return error.response;
  }
}


export async function getMyVideos() {
  try {
    const response = await axiosInstance.get("video/my-videos");
    return response;
  } catch (error:any) {
    console.error("Error fetching videos:", error);
    return error.response;
  }
}

export async function publishContent(videoId: any) {
  try {
    const response = await axiosInstance.patch(`/video/${videoId}/publish`);
    return response;
  } catch (error:any) {
    console.error("Error sending video for approval:", error);
    return error.response;
  }
}

export async function archiveVideo(videoId: any) {
  try {
    const response = await axiosInstance.patch(`/video/${videoId}/archive`);
    return response;
  } catch (error:any) {
    console.error("Error archiving video:", error);
    return error.response;
  }
}

export async function unarchiveVideo(videoId: any) {
  try {
    const response = await axiosInstance.patch(`/video/${videoId}/unarchive`);
    return response;
  } catch (error:any) {
    console.error("Error unarchiving video:", error);
    return error.response;
  }
}

export async function addCommentToVideo(videoId: any, comment: string) {
  try {
    const response = await axiosInstance.post(`/video/${videoId}/comment`, { comment });
    return response;
  } catch (error:any) {
    console.error("Error adding comment to video:", error);
    return error.response;
  }
}

export async function deleteVideo(videoId: any) {
  try {
    const response = await axiosInstance.delete(`/video/${videoId}`);
    return response;
  } catch (error:any) {
    console.error("Error deleting video:", error);
    return error.response;
  }
}

export async function deleteCretorVideo(videoId: any) {
  try {
    const response = await axiosInstance.delete(`/video/${videoId}/delete`);
    return response;
  } catch (error:any) {
    console.error("Error deleting video:", error);
    return error.response;
  }
}

export async function editVideoComment(id:any,comment:any){
  try {
    const response = await axiosInstance.patch(`/video/comment/${id}`, { comment });
    return response;
  } catch (error:any) {
    console.error("Error editing video comment:", error);
    return error.response;
  }
}

export async function addVideoComment(id:any,comment:any){
  try {
    const response = await axiosInstance.post(`/video/comment/`);
    return response;
  } catch (error:any) {
    console.error("Error adding video comment:", error);
    return error.response;
  }
}

export async function deleteVideoComment(commentId: any) {
  try {
    const response = await axiosInstance.delete(`/video/comment/${commentId}`);
    return response;
  } catch (error:any) {   
    console.error("Error deleting video comment:", error);
    return error.response;
  }
}


export async function getVideoById(videoId: any) {
  try {
    const response = await axiosInstance.get(`/video/${videoId}`);
    return response;
  } catch (error:any) {
    console.error("Error fetching video by ID:", error);    
  }
}


export async function getAllVideo() {
  try {
    const response = await axiosInstance.get('/video/get-all');
    return response;
  } catch (error:any) {
    console.error("Error fetching all videos:", error);
    return error.response;
  }
}

export async function getAllVideoCretor(creatorId: string) {
  try {
    const response = await axiosInstance.get(`/video/get-all?creator_id=${creatorId}`);
    return response;
  } catch (error:any) {
    console.error("Error fetching all videos:", error);
    return error.response;
  }
}


export async function getAllTrendingVideo() {
  try {
    const response = await axiosInstance.get('/video/get-all?trending=true');
    return response;
  } catch (error:any) {
    console.error("Error fetching all videos:", error);
    return error.response;
  }
}

export async function getAllTrendingContent() {
  try {
    const response = await axiosInstance.get("/content/trending");
    return response;
  } catch (error:any) {
    console.error("Error fetching video by creator:", error);
    return error.response;
  }
}


export async function getVideoByStatus(status: any) {
  try {
    const response = await axiosInstance.get(`/video/get-all?status=${status}`);
    return response;
  } catch (error:any) {
    console.error("Error fetching video by status:", error);
    return error.response;
  }
}

export async function toggleVideoLike(videoId: any) { 
  try {
    const response = await axiosInstance.post(`/video/${videoId}/toggle-like`);
    return response;
  } catch (error:any) {
    console.error("Error toggling video like:", error);
    return error.response;
  }
}

export async function approveVideo(videoId: any) {
  try {
    const response = await axiosInstance.patch(`/video/${videoId}/approve`);
    return response;
  } catch (error:any) {
    console.error("Error approving video:", error);
    return error.response;
  }
}

export async function rejectVideo(videoId: any,reason:string) {
  try {
    const response = await axiosInstance.patch(`/video/${videoId}/reject`,{reason});
    return response;
  } catch (error:any) {
    console.error("Error rejecting video:", error);
    return error.response;
  }
}

export async function addView(videoId: any) {
  try {
    const response = await axiosInstance.post(`/video/${videoId}/view`);
    return response;
  } catch (error:any) {
    console.error("Error adding view:", error);
    return error.response;
  }
}


export async function addWatchTime(videoId: string,watchTime: number) {
  try {
    const response = await axiosInstance.post(`/video/${videoId}/watch-time`,{watch_time: watchTime});
    return response;
  } catch (error:any) {
    // console.error("Error updating watch time:", error);
    return error.response;
  }
}


export async function getMostViewed() {
  try {
    const response = await axiosInstance.get('/content/most-viewed');
    return response;
  } catch (error:any) {
    console.error("Error fetching most viewed videos:", error);
    return error.response;
  }
}


export async function getMostLiked() {
  try {
    const response = await axiosInstance.get('/content/most-liked');
    return response;
  } catch (error:any) {
    console.error("Error fetching most liked videos:", error);
    return error.response;
  }
}

export async function addFollowing(creatorId: string) {
  try {
    const response = await axiosInstance.post(`/auth/follow/${creatorId}`);
    return response;
  } catch (error:any) {
    console.error("Error following creator:", error);
    return error.response;
  }

}

export async function removeFollowing(creatorId: string) {
  try {
    const response = await axiosInstance.post(`/auth/unfollow/${creatorId}`);
    return response;
  } catch (error:any) {
    console.error("Error following creator:", error);
    return error.response;
  }

}


export async function getFollowings() {
  try {
    const response = await axiosInstance.get('/auth/following');
    return response;
  } catch (error:any) {
    console.error("Error fetching followings:", error);
    return error.response;
  }
}


export async function getFollower() {
  try {
    const response = await axiosInstance.get(`/auth/followers`);
    return response;
  } catch (error:any) {
    console.error("Error fetching followers:", error);
    return error.response;
  }
}

