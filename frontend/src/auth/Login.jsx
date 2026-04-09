import { useState } from "react";
import { login } from "../api/auth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const roleRes = await api.get("/test");
      const role = roleRes.data;
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      setUser({ email, role });
      navigate("/");
    } catch {
      alert("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0D1117]">
      {/* LEFT — IMAGE PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=90"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-[#0D1117]/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="section-label mb-4">Welcome Back</p>
            <h2 className="font-serif text-5xl text-white font-semibold leading-tight mb-4">
              Your Journey<br />
              <em className="gold-text not-italic">Awaits</em>
            </h2>
            <div className="gold-divider-left mb-4" />
            <p className="text-[#E8E0D0]/50 text-sm leading-relaxed max-w-xs">
              Sign in to access your bookings, exclusive offers, and personalised concierge services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT — FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          {/* LOGO */}
          <div className="mb-12">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 border border-[#C9A84C]/50 flex items-center justify-center">
                <span className="text-[#C9A84C] text-xs">✦</span>
              </div>
              <span className="font-serif text-lg text-[#E8C97A] tracking-widest">THE GRAND</span>
            </button>
            <p className="section-label mb-3">Member Sign In</p>
            <h1 className="font-serif text-4xl text-white font-semibold mb-2">Welcome Back</h1>
            <div className="gold-divider-left mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
                <input
                  className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
                <input
                  className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* FORGOT */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[#C9A84C]/60 hover:text-[#C9A84C] text-[10px] tracking-[0.15em] uppercase transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* SUBMIT */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="btn-gold w-full py-4 disabled:opacity-50"
            >
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </motion.button>

            {/* DIVIDER */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#C9A84C]/10" />
              <span className="text-[#E8E0D0]/20 text-[10px] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#C9A84C]/10" />
            </div>

            {/* REGISTER */}
            <p className="text-center text-[#E8E0D0]/40 text-xs tracking-wide">
              New to The Grand?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors font-medium"
              >
                Create an Account
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
