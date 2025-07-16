import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string;
    email: string;
    role:string
    profileImage?: string;
}

const initialState: User = {
  id:"",
  username:"",
  email:"",
  role:"",
  profileImage: ""
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
    },
    getUser(state) {
      return state;
    }
  },
});

export const { setUser, getUser } = userSlice.actions;
export default userSlice.reducer;
