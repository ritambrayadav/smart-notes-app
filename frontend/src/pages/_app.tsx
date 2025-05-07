import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AuthGuard from "@/components/AuthGaurd";

const protectedRoutes = ["/dashboard", "/notes", "/profile"];

export default function App({ Component, pageProps, router }: AppProps) {
  const isProtected = protectedRoutes.includes(router.pathname);

  return (
    <Provider store={store}>
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
