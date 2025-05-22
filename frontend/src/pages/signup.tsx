import React, { useState } from "react";
import { useRouter } from "next/router";
import { signup } from "@/api/auth";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import LinkText from "@/components/common/LinkText";

const Signup = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });

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
      await signup(userData);
      setUserData({ userName: "", email: "", password: "" });
      router.push("/login");
    } catch (err: any) {
      console.log(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign up here</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="userName"
            placeholder="Name"
            value={userData.userName}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <LinkText href="/login"> Login Here</LinkText>
        </p>
      </div>
    </div>
  );
};

export default Signup;
