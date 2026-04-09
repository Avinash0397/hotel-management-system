import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  useEffect(() => { if (!email) navigate("/forgot-password"); }, [email, navigate]);

  const checkStrength = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[!@#$%^&*]/.test(pwd)) s++;
    setStrength(s);
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setMessage({ text: "Password updated successfully.", type: "success" });
      localStorage.removeItem("resetEmail");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setMessage({ text: "Invalid OTP. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=90" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-[#0D1117]/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <p className="section-label mb-4">New Password</p>
            <h2 className="font-serif text-5xl text-white font-semibold leading-tight mb-4">
              Secure Your<br /><em className="gold-text not-italic">Account</em>
            </h2>
            <div className="gold-divider-left mb-4" />
            <p className="text-[#E8E0D0]/50 text-sm leading-relaxed max-w-xs">
              Enter the OTP from your email and create a strong new password.
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
            <p className="section-label mb-3">Reset Password</p>
            <h1 className="font-serif text-4xl text-white font-semibold mb-2">New Password</h1>
            <div className="gold-divider-left mt-4" />
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

          <div className="space-y-5">
            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Verification Code (OTP)</label>
              <input
                className="luxury-input w-full px-4 py-3.5 text-center text-xl font-mono tracking-[0.4em]"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
                <input
                  type="password"
                  className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); checkStrength(e.target.value); }}
                />
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`flex-1 h-0.5 transition-all ${i < strength ? strengthColors[strength - 1] : "bg-[#C9A84C]/10"}`} />
                    ))}
                  </div>
                  <p className="text-[#E8E0D0]/30 text-[10px] tracking-wider mt-1">Strength: {strength}/4</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
                <input
                  type="password"
                  className="luxury-input w-full pl-10 pr-10 py-3.5 text-sm tracking-wide"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && (
                  <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm ${newPassword === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                    {newPassword === confirmPassword ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={resetPassword}
              disabled={loading || newPassword !== confirmPassword || !otp}
              className="btn-gold w-full py-4 disabled:opacity-50"
            >
              <span>{loading ? "Updating..." : "Reset Password"}</span>
            </motion.button>

            <p className="text-center text-[#E8E0D0]/40 text-xs tracking-wide">
              <button onClick={() => navigate("/login")} className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors font-medium">
                Back to Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
