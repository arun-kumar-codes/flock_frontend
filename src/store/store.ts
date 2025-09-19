import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/slice/userSlice';
import dashboardReducer from '@/slice/dashbaordSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    dashboard:dashboardReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
