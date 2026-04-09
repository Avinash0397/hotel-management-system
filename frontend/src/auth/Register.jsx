import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight } from "react-icons/fa";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ firstName, lastName, email, number, password, role });
      localStorage.setItem("otpEmail", email);
      setMessage("success");
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch {
      setMessage("error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      {/* LEFT IMAGE PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=90"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-[#0D1117]/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <p className="section-label mb-4">New Member</p>
            <h2 className="font-serif text-5xl text-white font-semibold leading-tight mb-4">
              Begin Your<br /><em className="gold-text not-italic">Story</em>
            </h2>
            <div className="gold-divider-left mb-4" />
            <p className="text-[#E8E0D0]/50 text-sm leading-relaxed max-w-xs">
              Create your account and unlock exclusive rates, personalised stays, and concierge services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 border border-[#C9A84C]/50 flex items-center justify-center">
                <span className="text-[#C9A84C] text-xs">✦</span>
              </div>
              <span className="font-serif text-lg text-[#E8C97A] tracking-widest">THE GRAND</span>
            </button>
            <p className="section-label mb-3">Create Account</p>
            <h1 className="font-serif text-4xl text-white font-semibold mb-2">Join Us</h1>
            <div className="gold-divider-left mt-4" />
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 text-xs tracking-wider text-center ${message === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}
            >
              {message === "success" ? "Account created! Redirecting to verification..." : "Registration failed. Please try again."}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "First Name", value: firstName, set: setFirstName, icon: <FaUser />, placeholder: "John" },
                { label: "Last Name", value: lastName, set: setLastName, icon: <FaUser />, placeholder: "Doe" },
              ].map(({ label, value, set, icon, placeholder }) => (
                <div key={label}>
                  <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">{label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs">{icon}</span>
                    <input
                      className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                      placeholder={placeholder}
                      value={value}
                      onChange={e => set(e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {[
              { label: "Phone Number", value: number, set: setNumber, icon: <FaPhone />, placeholder: "+91 98765 43210", type: "tel" },
              { label: "Email Address", value: email, set: setEmail, icon: <FaEnvelope />, placeholder: "your@email.com", type: "email" },
              { label: "Password", value: password, set: setPassword, icon: <FaLock />, placeholder: "••••••••", type: "password" },
            ].map(({ label, value, set, icon, placeholder, type = "text" }) => (
              <div key={label}>
                <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">{label}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs">{icon}</span>
                  <input
                    type={type}
                    className="luxury-input w-full pl-10 pr-4 py-3.5 text-sm tracking-wide"
                    placeholder={placeholder}
                    value={value}
                    onChange={e => set(e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Account Type</label>
              <select
                className="luxury-input w-full px-4 py-3.5 text-sm tracking-wide cursor-pointer"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="CUSTOMER" className="bg-[#111318]">Customer</option>
                <option value="MANAGER" className="bg-[#111318]">Manager</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="btn-gold w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              {!loading && <FaArrowRight size={12} />}
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#C9A84C]/10" />
              <span className="text-[#E8E0D0]/20 text-[10px] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-[#C9A84C]/10" />
            </div>

            <p className="text-center text-[#E8E0D0]/40 text-xs tracking-wide">
              Already a member?{" "}
              <button type="button" onClick={() => navigate("/login")} className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors font-medium">
                Sign In
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
