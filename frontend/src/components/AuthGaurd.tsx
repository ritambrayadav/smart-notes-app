import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { JSX, useEffect } from "react";
import { RootState } from "@/redux/store";
import LoadingMessage from "./common/LoadingNotesMessage";
import { logout } from "@/utils/logout";

type Props = {
  children: JSX.Element;
};

const AuthGuard = ({ children }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      logout();
    }
  }, [user, router]);

  if (!user) return <LoadingMessage />;

  return children;
};

export default AuthGuard;
