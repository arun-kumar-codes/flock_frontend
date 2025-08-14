import axiosInstance from "@/lib/axiosInstance";

export const getEarnings=async()=>{
       try {
    const response = await axiosInstance.get('/earnings/get-earnings');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}


export const getEarningHistory=async()=>{
       try {
    const response = await axiosInstance.get('/earnings/get-earnings-history');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const getCpmRate=async()=>{
       try {
    const response = await axiosInstance.get('/earnings/active-cpm-rate');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}