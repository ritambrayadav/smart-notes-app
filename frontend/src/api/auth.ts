import axiosInstance from "./api";

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
  const res = await axiosInstance.post("/signup", data);
  return res.data;
};

export const login = async (data: LoginData) => {
  const res = await axiosInstance.post("/login", data);
  return res.data;
};
