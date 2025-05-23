import { logOut } from "@/api/auth";
export const logout = async () => {
  await logOut();
  sessionStorage.clear();
  window.location.href = "/login";
};
