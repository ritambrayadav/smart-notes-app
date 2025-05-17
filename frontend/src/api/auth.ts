import axiosInstance from "./api";
import { PATH } from "./path";
import { getSessionItem } from "@/utils/sessionStorage";
import {
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  updateOnBoardingSeenStart,
  updateOnBoardingSeenSuccess,
  updateOnBoardingSeenFailure,
} from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    userName: string;
    email: string;
    hasSeenOnboarding: boolean;
  };
}

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post<AuthResponse>(
      `${PATH.auth}/signup`,
      data
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Signup failed");
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post<AuthResponse>(
      `${PATH.auth}/login`,
      data
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};
export const fetchUserByIdAndDispatch = async (dispatch: AppDispatch) => {
  const user = getSessionItem("user");
  try {
    dispatch(getUserByIdStart());
    const res = await axiosInstance.get(`${PATH.auth}/${user?.userId}`);
    dispatch(getUserByIdSuccess(res.data.user));
  } catch (error: any) {
    dispatch(
      getUserByIdFailure(
        error?.response?.data?.message || "Failed to fetch user"
      )
    );
    throw error;
  }
};
export const markOnboardingSeen = async (dispatch: AppDispatch) => {
  const user = getSessionItem("user");
  try {
    dispatch(updateOnBoardingSeenStart());
    const res = await axiosInstance.put<{ success: boolean }>(
      `${PATH.auth}/${user?.userId}`
    );
    dispatch(updateOnBoardingSeenSuccess());
  } catch (error: any) {
    dispatch(
      updateOnBoardingSeenFailure(
        error?.response?.data?.message || "Failed to update onboarding status"
      )
    );
    throw error;
  }
};
