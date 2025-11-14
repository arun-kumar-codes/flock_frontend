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

export const getEarning=async()=>{
    try {
    const response = await axiosInstance.get('/earnings/available-for-withdrawal');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const setupStripeAccount=async()=>{
    try {
    const response = await axiosInstance.post('/earnings/setup-stripe-account');
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const getStripeAccount=async()=>{
    try {
    const response = await axiosInstance.get('/earnings/stripe-account');
    return response;
  } catch (error:any) {
    // console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const removeStripeAccount=async()=>{
    try {
    const response =  await axiosInstance.post("/earnings/remove-stripe-account");
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const refreshStripeAccount=async()=>{
    try {
    const response =  await axiosInstance.get("/earnings/stripe-account-status");
    return response;
  } catch (error:any) {
    console.error("Error fetching creator data:", error);
    return error.response;
  }
}

export const requestWithdrawal = async (amount: number) => {
  try {
    const response = await axiosInstance.post("/earnings/request-withdrawal", {
      amount,
    });
    return response;
  } catch (error: any) {
    console.error("Error requesting withdrawal:", error);
    return error.response;
  }
};

export const withdrawalHistory = async () => {
  try{
    const response = await axiosInstance("/earnings/withdrawal-history")
    return response;
  }catch (error: any){
    console.error("Error Fetching withdrawal history:", error);
    return error.response;
  }
}


export async function setupPayPalAccount() {
  try {
    const response = await axiosInstance.post("/paypal/setup-paypal-account");
    return response;
  } catch (error: any) {
    console.error("Error setting up PayPal:", error);
    return error.response;
  }
}


export async function getPayPalAccount() {
  try {
    const response = await axiosInstance.get("/paypal/paypal-account");
    return response;
  } catch (error: any) {
    console.error("Error fetching PayPal account:", error);
    return error.response;
  }
}

export async function requestPayPalWithdrawal(amount: number) {
  try {
    const response = await axiosInstance.post("/paypal/request-paypal-withdrawal", { amount });
    return response;
  } catch (error: any) {
    console.error("Error requesting PayPal withdrawal:", error);
    return error.response;
  }
}

export async function payPalWithdrawalHistory() {
  try {
    const response = await axiosInstance.get("/earnings/withdrawal-history");
    return response;
  } catch (error: any) {
    console.error("Error fetching PayPal withdrawal history:", error);
    return error.response;
  }
}

export const removePayPalAccount = async () => {
  try {
    const response = await axiosInstance.post("/paypal/remove-paypal");
    return response;
  } catch (error: any) {
    console.error("Error removing PayPal account:", error);
    return error.response;
  }
};


export async function checkPayPalPayoutStatus(batchId: string) {
  try {
    const response = await axiosInstance.get(`/paypal/check-paypal-status/${batchId}`);
    return response;
  } catch (error:any) {
    console.error("Error checking PayPal payout status:", error);
    return error.response;
  }
}
