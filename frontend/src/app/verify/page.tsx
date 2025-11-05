"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const VerifyOTP = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // ✅ Countdown
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ✅ Stable refs
  const inputRefs = useRef<HTMLInputElement[]>([]);

  /* ✅ Timer countdown */
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* ✅ Resend OTP */
  const handleResendOTP = async () => {
    try {
      setTimer(60);
      setCanResend(false);

      await axios.post("http://localhost:5000/api/v1/resend", { email });

      alert("OTP resent!");
    } catch (error) {
      console.error(error);
      alert("Error resending OTP");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ✅ Verify OTP */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/v1/verify", {
        email,
        otp: finalOtp,
      }, { withCredentials: true });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
        <p className="text-gray-600 mb-6 text-sm">OTP sent to {email}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  if (el) inputRefs.current[i] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                autoFocus={i === 0}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 text-center border rounded-xl text-lg outline-none bg-gray-50 focus:ring-2"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium cursor-pointer transition-all"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* ✅ Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full mt-3 border border-gray-300 hover:bg-gray-200 text-black py-3 rounded-xl font-medium cursor-pointer transition-all"
        >
          Back
        </button>

        {/* ✅ Resend OTP */}
        <div className="mt-4">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              className="text-blue-600 font-medium"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend OTP in <b>{timer}</b>s
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
