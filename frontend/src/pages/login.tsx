import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { login } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/slices/authSlice";

const PRIMARY_COLOR = "indigo-600"; // Theme color

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(userData);
      dispatch(setUser({ user: res.user, token: res.token }));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-${PRIMARY_COLOR} text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}

        <p className="text-center mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-medium hover:underline">
            Register Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
