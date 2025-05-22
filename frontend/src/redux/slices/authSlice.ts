import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSessionItem, setSessionItem } from "@/utils/sessionStorage";
import { AuthState, User, AuthPayload } from "@/utils/interface";

const initialState: AuthState = {
  user: getSessionItem<User>("user"),
  fetchedUser: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthPayload>) {
      const { user } = action.payload;

      if (user) {
        state.user = user;
        setSessionItem("user", user);
      }
    },
    getUserByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    getUserByIdSuccess(state, action: PayloadAction<User>) {
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
    updateOnBoardingSeenSuccess(state) {
      state.error = null;
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
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  updateOnBoardingSeenStart,
  updateOnBoardingSeenSuccess,
  updateOnBoardingSeenFailure,
} = authSlice.actions;
export default authSlice.reducer;
