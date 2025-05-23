import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
const AuthGuard = dynamic(() => import("@/components/auth/AuthGaurd"), {
  ssr: false,
});
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const protectedRoutes = ["/dashboard", "/notes"];

export default function App({ Component, pageProps, router }: AppProps) {
  const isProtected = protectedRoutes.includes(router.pathname);
  return (
    <Provider store={store}>
      <ToastContainer />
      {isProtected ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}
