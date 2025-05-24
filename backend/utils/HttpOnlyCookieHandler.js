import { serialize } from "cookie";

export const setHttpOnlyCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "default";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  });
};
export const clearHttpOnlyCookie = (res) => {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "default",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  res.setHeader("Set-Cookie", cookie);
};
