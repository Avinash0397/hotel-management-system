import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  useEffect(() => { if (!email) navigate("/register"); }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const submitOtp = async () => {
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setMessage({ text: "Account verified successfully!", type: "success" });
      localStorage.removeItem("otpEmail");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMessage({ text: "Invalid OTP. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { email });
      setMessage({ text: "OTP resent to your email.", type: "success" });
      setTimer(300);
      setOtp("");
    } catch {
      setMessage({ text: "Failed to resend OTP.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=90" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-[#0D1117]/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <p className="section-label mb-4">Almost There</p>
            <h2 className="font-serif text-5xl text-white font-semibold leading-tight mb-4">
              Verify Your<br /><em className="gold-text not-italic">Identity</em>
            </h2>
            <div className="gold-divider-left mb-4" />
            <p className="text-[#E8E0D0]/50 text-sm leading-relaxed max-w-xs">
              Enter the one-time password sent to your email to complete registration.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 border border-[#C9A84C]/50 flex items-center justify-center">
                <span className="text-[#C9A84C] text-xs">✦</span>
              </div>
              <span className="font-serif text-lg text-[#E8C97A] tracking-widest">THE GRAND</span>
            </button>
            <p className="section-label mb-3">Email Verification</p>
            <h1 className="font-serif text-4xl text-white font-semibold mb-2">Verify OTP</h1>
            <div className="gold-divider-left mt-4" />
            <p className="text-[#E8E0D0]/40 text-xs tracking-wide mt-3">
              Code sent to <span className="text-[#C9A84C]">{email}</span>
            </p>
          </div>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 text-xs tracking-wider text-center ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">One-Time Password</label>
              <input
                className="luxury-input w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.5em]"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="text-center">
              <span className={`text-xs tracking-widest uppercase ${timer < 60 ? "text-red-400" : "text-[#C9A84C]"}`}>
                Expires in {formatTime(timer)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={submitOtp}
              disabled={loading || otp.length !== 6}
              className="btn-gold w-full py-4 disabled:opacity-50"
            >
              <span>{loading ? "Verifying..." : "Verify OTP"}</span>
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#C9A84C]/10" />
              <span className="text-[#E8E0D0]/20 text-[10px] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#C9A84C]/10" />
            </div>

            <p className="text-center text-[#E8E0D0]/40 text-xs tracking-wide">
              Didn't receive the code?{" "}
              <button onClick={resendOtp} disabled={loading} className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors font-medium">
                Resend OTP
              </button>
            </p>

            <p className="text-center text-[#E8E0D0]/40 text-xs tracking-wide">
              Wrong email?{" "}
              <button onClick={() => navigate("/register")} className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors font-medium">
                Back to Registration
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
