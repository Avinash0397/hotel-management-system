import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitEmail = async () => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      localStorage.setItem("resetEmail", email);
      setMessage({ text: "Recovery code sent to your email.", type: "success" });
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch {
      setMessage({ text: "Email not found. Please check and try again.", type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=90" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-[#0D1117]/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <p className="section-label mb-4">Account Recovery</p>
            <h2 className="font-serif text-5xl text-white font-semibold leading-tight mb-4">
              Recover Your<br /><em className="gold-text not-italic">Access</em>
            </h2>
            <div className="gold-divider-left mb-4" />
            <p className="text-[#E8E0D0]/50 text-sm leading-relaxed max-w-xs">
              We'll send a recovery code to your registered email address.
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
            <p className="section-label mb-3">Password Recovery</p>
            <h1 className="font-serif text-4xl text-white font-semibold mb-2">Forgot Password?</h1>
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

          <div className="space-y-6">
            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
                <input
                  type="email"
                  className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={submitEmail}
              disabled={loading}
              className="btn-gold w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Sending..." : "Send Recovery Code"}</span>
              {!loading && <FaArrowRight size={12} />}
            </motion.button>

            <p className="text-center text-[#E8E0D0]/40 text-xs tracking-wide">
              Remember your password?{" "}
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
