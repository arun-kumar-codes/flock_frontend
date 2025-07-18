import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string;
    email: string;
    role:string
    profileImage?: string;
    is_profile_completed?:boolean
}

const initialState: User = {
  id:"",
  username:"",
  email:"",
  role:"",
  profileImage: "",
  is_profile_completed:true,
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
    },
    logOut(state){
      state.id=""
      state.username=""
      state.email=""
      state.role=""
      state.profileImage=""
      state.is_profile_completed=true

    }
  },
});

export const { setUser,logOut } = userSlice.actions;
export default userSlice.reducer;
