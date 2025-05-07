import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { JSX, useEffect } from "react";
import { RootState } from "@/redux/store";

type Props = {
  children: JSX.Element;
};

const AuthGuard = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return children;
};

export default AuthGuard;
