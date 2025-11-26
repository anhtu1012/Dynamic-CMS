/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/authSlice.js

import { UserSchema } from "@/lib/schemas/auth/auth.schema";
import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  refreshToken: "",
  userProfile: {} as UserSchema,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, userProfile } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userProfile = userProfile;
    },
    clearAuthData: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.userProfile = {} as UserSchema; // Reset to initial state
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export const selectAuthLogin = (state: RootState) => state.auth;

export default authSlice.reducer;
