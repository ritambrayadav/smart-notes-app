import axiosInstance from "./api";

const PATH = "/api/auth";
interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const res = await axiosInstance.post(`${PATH}/register`, data);
  return res.data;
};

export const login = async (data: LoginData) => {
  const res = await axiosInstance.post(`${PATH}/login`, data);
  return res.data;
};
