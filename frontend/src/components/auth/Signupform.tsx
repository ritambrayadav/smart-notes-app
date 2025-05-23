import React, { useState } from "react";
import { useRouter } from "next/router";
import { signup } from "@/api/auth";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import LinkText from "@/components/common/LinkText";

const SignupForm = () => {
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
      console.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <p className="text-center mt-4 text-sm">
        Already have an account?
        <LinkText href="/login"> Login Here</LinkText>
      </p>
    </form>
  );
};

export default SignupForm;
