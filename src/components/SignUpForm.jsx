import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerUser } from "../services/auth";

const SignUpForm = ({ buttonClasses, buttonForGFT, onSwitchToSignIn }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signup, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data?.message || "SignUp successfull!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      if (onSwitchToSignIn) onSwitchToSignIn();
    },
    onError: (error) => {
      const response = error?.response?.data;

      if (Array.isArray(response?.errors)) {
        response.errors.forEach((err) => toast.error(err));
      } else if (typeof response?.error === "string") {
        toast.error(response.error);
      } else {
        toast.error("Sign up failed");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ firstName, lastName, email, password });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0 border border-gray-100">
      <div className="p-6 space-y-6 md:space-y-7 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-[#03C9D7] md:text-2xl text-center">
          Create Account
          <p className="text-sm font-normal text-gray-500 mt-1">
            Sign up to get started
          </p>
        </h1>

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 md:gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#039BAB] focus:border-[#039BAB] block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="First name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#039BAB] focus:border-[#039BAB] block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="Last name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#039BAB] focus:border-[#039BAB] block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#d5f2ec] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#039BAB] focus:border-[#039BAB] block w-full pl-10 p-3 transition-all duration-200 shadow-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <button type="submit" className={buttonClasses} disabled={isPending}>
            {isPending ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4 border-t border-gray-100 pt-4">
          Already have an account?{" "}
          <span
            onClick={onSwitchToSignIn}
            className="text-[#03C9D7] cursor-pointer hover:underline"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter") onSwitchToSignIn();
            }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
