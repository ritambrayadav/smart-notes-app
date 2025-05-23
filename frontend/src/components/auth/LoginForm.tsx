import React, { useState } from "react";
import { login } from "@/api/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import LinkText from "@/components/common/LinkText";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(userData);
      dispatch(setUser({ user: res.user }));
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={userData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          value={userData.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center mt-6 text-sm text-gray-600">
        Don&apos;t have an account?
        <LinkText href="/signup"> Sign up Here</LinkText>
      </p>
    </form>
  );
};

export default LoginForm;
