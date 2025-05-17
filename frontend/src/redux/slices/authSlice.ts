import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "@/utils/sessionStorage";
export interface DecodedUser {
  userId: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  user: DecodedUser | null;
}

interface AuthState {
  user: DecodedUser | null;
  token: string | null;
  fetchedUser: DecodedUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: getSessionItem<DecodedUser>("user"),
  token: getSessionItem<string>("token"),
  fetchedUser: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthPayload>) {
      const { token, user } = action.payload;

      if (user) {
        state.user = user;
        state.token = token;
        setSessionItem("user", user);
        setSessionItem("token", token);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      removeSessionItem("user");
      removeSessionItem("token");
    },
    getUserByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    getUserByIdSuccess(state, action: PayloadAction<DecodedUser>) {
      state.fetchedUser = action.payload;
      state.loading = false;
    },
    getUserByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateOnBoardingSeenStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateOnBoardingSeenSuccess(state, action: PayloadAction<DecodedUser>) {
      state.fetchedUser = action.payload;
      state.loading = false;
    },
    updateOnBoardingSeenFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  logout,
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  updateOnBoardingSeenStart,
  updateOnBoardingSeenSuccess,
  updateOnBoardingSeenFailure,
} = authSlice.actions;
export default authSlice.reducer;
