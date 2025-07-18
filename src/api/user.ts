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


export async function getAllCreator() {
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


export async function deleteUser(data: any) {
  try {
    const response = await axiosInstance.delete(`/auth/delete-user/${data}`);
    return response;
  } catch (error:any) {
    console.error("Error changing password:", error);
    return error.response;
  }
}
