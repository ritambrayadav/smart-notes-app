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
import { SignupData, LoginData, AuthResponse } from "@/utils/interface";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { store } from "@/redux/store";

export const signup = async (data: SignupData): Promise<SignupData> => {
  try {
    const res = await axiosInstance.post<SignupData>(
      `${PATH.auth}/signup`,
      data
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err?.response?.data?.message || "Signup failed");
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post<AuthResponse>(
      `${PATH.auth}/login`,
      data
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err?.response?.data?.message || "Login failed");
  }
};
export const logOut = async (): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post<AuthResponse>(`${PATH.auth}/logout`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err?.response?.data?.message || "Logout failed");
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
export const markOnboardingSeen = async () => {
  const dispatch = store.dispatch;
  const user = getSessionItem("user");
  try {
    dispatch(updateOnBoardingSeenStart());
    const res = await axiosInstance.put<{ message: string }>(
      `${PATH.auth}/${user?.userId}`
    );
    toast.success(res.data.message);
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
