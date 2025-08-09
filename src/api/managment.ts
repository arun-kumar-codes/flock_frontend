import axiosInstance from "@/lib/axiosInstance";

export const getCpm=async()=>{
       try {
    const response = await axiosInstance.get('/cpm/active-config');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const updateCpm=async(cpmRate:number)=>{
       try {
    const response = await axiosInstance.put('/cpm/update-config',{cpm_rate:cpmRate});
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const getHistory=async()=>{
       try {
    const response = await axiosInstance.get('/cpm/history');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const deleteHistory=async()=>{
       try {
    const response = await axiosInstance.delete('/cpm/delete-history');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}