import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  profile_picture?: string;
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  is_profile_completed?: boolean;
  loading?: boolean;
  isLogin: boolean;
  theme?: string;
}

// Safe access to localStorage (browser check)
const isBrowser = typeof window !== 'undefined';
const storedTheme = isBrowser ? localStorage.getItem('theme') : null;

const initialState: User = {
  id: "",
  username: "",
  email: "",
  role: "",
  profileImage: "",
  is_profile_completed: true,
  loading: true,
  isLogin: false,
  theme: storedTheme || "light",
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
      // state.is_profile_completed = action.payload.is_profile_completed;
      state.profileImage = action.payload.profile_picture || "";
      state.loading = false;
      state.isLogin = true;

      // Reload theme from localStorage when user logs in (optional)
      if (isBrowser) {
        state.theme = localStorage.getItem('theme') || 'light';
      }
    },

    updateUser(state, action: PayloadAction<Partial<User>>) {
      Object.assign(state, action.payload);
      state.loading = false;
    },

    logOut(state) {
      state.id = "";
      state.username = "";
      state.email = "";
      state.role = "";
      state.profileImage = "";
      state.is_profile_completed = true;
      state.loading = true;
      state.isLogin = false;

      if (isBrowser) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },

    toggleThemeMode(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';

      if (isBrowser) {
        localStorage.setItem('theme', state.theme);
      }
    },

    // Optional: allows setting theme manually (e.g. from useEffect)
    setTheme(state, action: PayloadAction<string>) {
      if(state.role==="admin"||state.role==="cretor"){
        state.theme='light';
      }else{

        state.theme = action.payload;
      }
      if (isBrowser) {
        localStorage.setItem('theme', action.payload);
      }
    }
  },
});

export const { setUser, logOut, toggleThemeMode, setTheme } = userSlice.actions;
export default userSlice.reducer;
