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


export async function inviteUser(data: any) {
  try {
    const response = await axiosInstance.post('/email/send-invitation', data);
    return response;
  } catch (error:any) {
    console.error("Error updating user profile:", error);
    return error.response;
  }
}


export async function updateUserProfile(data: any) {
  try {
    const response = await axiosInstance.put('/auth/complete-profile' , data);
    return response;
  } catch (error:any) {
    console.error("Error updating user profile:", error);
    return error.response;
  }
}

export async function updateProfile(data: any) {
  try {
    const response = await axiosInstance.put('/auth/update-profile' , data,{
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response;
  } catch (error:any) {
    console.error("Error updating user profile:", error);
    return error.response;
  }
}

export async function changePassword(data: any) {
  try {
    const response = await axiosInstance.put('/auth/change-password', data);
    return response;
  } catch (error:any) {
    console.error("Error changing password:", error);
    return error.response;
  }
}

export async function getAllUser() {
  try {
    const response = await axiosInstance.get('/auth/all-users');
    return response;
  } catch (error:any) {
    console.error("Error changing password:", error);
    return error.response;
  }
}



export async function getAllViewer() {
  try {
    const response = await axiosInstance.get('/auth/all-users');
    return response;
  } catch (error:any) {
    console.error("Error changing password:", error);
    return error.response;
  }
}


export async function getAllCreators() {
  try {
    const response = await axiosInstance.get('/auth/all-creators');
    return response;
  } catch (error:any) {
    console.error("Error changing password:", error);
    return error.response;
  }
}


export async function deleteUser(data: any) {
  try {
    const response = await axiosInstance.delete(`/auth/delete-user/${data}`);
    return response;
  } catch (error:any) {
    console.error("Error changing password:", error);
    return error.response;
  }
}


export async function getCreatorData(){
  try {
    const response = await axiosInstance.get('/auth/creator-data');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}


export async function becomeCreator() {
  try {
    const response = await axiosInstance.post('/auth/change-to-creator');
    return response;
  } catch (error:any) {
    console.error("Error becoming a creator:", error);
    return error.response;
  }
}