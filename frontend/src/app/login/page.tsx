"use client";
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const {data} = await axios.post("http://localhost:5000/api/v1/login",{email});
      router.push(`/verify?email=${email}`);
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center border rounded-xl px-4 py-3 gap-3 bg-gray-50 focus-within:ring-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-black to-gray-700 hover:opacity-90 text-white py-3 rounded-xl font-medium cursor-pointer transition-all"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

