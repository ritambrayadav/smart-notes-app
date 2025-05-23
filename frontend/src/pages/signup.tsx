import React from "react";
import SignupForm from "@/components/auth/Signupform";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign up here</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
