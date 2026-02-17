'use client';
import React, { useState } from 'react';
import { IoIosSend } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Swal from 'sweetalert2';

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    setLoading(false);

    if (result?.ok) {
      router.push("/products"); 
      return;
    }

    const code = (result?.error || "").toString().trim();

    Swal.fire({
      icon: "error",
      title: "Login failed",
      text: code === "AUTH_FAILED" ? "Invalid username or password." : code,
      confirmButtonColor: "#e63946",
    });

    setErrors(prev => ({
      ...prev,
      username: "Invalid username or password.",
      password: "Invalid username or password."
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-center mb-6 text-black text-2xl font-semibold">
          Please Enter Your Credentials to Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block uppercase tracking-wide text-gray-700 mb-2">Username</label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500`}
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: "" });
              }}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block uppercase tracking-wide text-gray-700 mb-2">Password</label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500`}
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-xl hover:bg-pink-800 rounded-full py-3 flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
            style={{ backgroundColor: '#C8187D' }}
          >
            <IoIosSend className="inline" />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-center gap-5 mt-4 text-sm text-gay-500">
          
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
