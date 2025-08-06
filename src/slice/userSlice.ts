import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    profile_picture?: string;
    id: string;
    username: string;
    email: string;
    role:string
    profileImage?: string;
    is_profile_completed?:boolean;
    loading?: boolean;
}

const initialState: User = {
  id:"",
  username:"",
  email:"",
  role:"",
  profileImage: "",
  is_profile_completed:true,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
       state.id = action.payload.id;
  state.username = action.payload.username;
  state.email = action.payload.email;
  state.role = action.payload.role;
  state.is_profile_completed=action.payload.is_profile_completed;
  state.profileImage = action.payload.profile_picture || "";
  state.loading = false;
    },
    logOut(state){
      state.id=""
      state.username=""
      state.email=""
      state.role=""
      state.profileImage=""
      state.is_profile_completed=true
      state.loading = true;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");


    }
  },
});

export const { setUser,logOut } = userSlice.actions;
export default userSlice.reducer;
