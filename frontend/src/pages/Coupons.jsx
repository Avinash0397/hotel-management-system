import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTag, FaPlus, FaTrash, FaCheckCircle, FaTimesCircle,
  FaPercent, FaCalendarAlt, FaUsers
} from "react-icons/fa";

export default function Coupons() {
  const role = localStorage.getItem("role");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", discountPercent: "", maxDiscount: "", expiryDate: "", usageLimit: "" });
  const [adding, setAdding] = useState(false);
  const [testCode, setTestCode] = useState("");
  const [testAmount, setTestAmount] = useState("");
  const [testResult, setTestResult] = useState(null);

  const load = async () => {
    try { setLoading(true); const res = await api.get("/coupons"); setCoupons(res.data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createCoupon = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/coupons", {
        ...form,
        code: form.code.toUpperCase(),
        discountPercent: Number(form.discountPercent),
        maxDiscount: Number(form.maxDiscount),
        usageLimit: Number(form.usageLimit)
      });
      setForm({ code: "", discountPercent: "", maxDiscount: "", expiryDate: "", usageLimit: "" });
      load();
    } catch { alert("Failed to create coupon"); } finally { setAdding(false); }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await api.delete(`/coupons/${id}`);
    load();
  };

  const validateCoupon = async () => {
    if (!testCode || !testAmount) return;
    try {
      const res = await api.post("/coupons/validate", { code: testCode, amount: Number(testAmount) });
      setTestResult({ ...res.data, success: true });
    } catch (err) {
      setTestResult({ success: false, message: err?.response?.data?.message || "Invalid coupon" });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-14">
          <p className="section-label mb-3">Promotions</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-2">Coupons & Offers</h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/30 text-xs tracking-wide">{coupons.filter(c => c.active).length} active coupons available</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT: COUPON TESTER */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="luxury-card p-6 mb-6">
              <h2 className="font-serif text-2xl text-white mb-5 flex items-center gap-3">
                <FaTag className="text-[#C9A84C]" /> Test a Coupon
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Coupon Code</label>
                  <input
                    value={testCode}
                    onChange={e => setTestCode(e.target.value.toUpperCase())}
                    placeholder="SAVE20"
                    className="luxury-input w-full px-4 py-3 text-sm font-mono tracking-widest uppercase"
                  />
                </div>
                <div>
                  <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Booking Amount (₹)</label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={e => setTestAmount(e.target.value)}
                    placeholder="5000"
                    className="luxury-input w-full px-4 py-3 text-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={validateCoupon}
                  className="btn-gold w-full py-3"
                >
                  <span>Validate Coupon</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`mt-5 p-4 border ${testResult.success ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {testResult.success ? <FaCheckCircle className="text-green-400" size={12} /> : <FaTimesCircle className="text-red-400" size={12} />}
                      <span className={`text-xs tracking-wider ${testResult.success ? "text-green-400" : "text-red-400"}`}>{testResult.message}</span>
                    </div>
                    {testResult.success && (
                      <div className="space-y-1 text-xs text-[#E8E0D0]/50 tracking-wide">
                        <p>Discount: <span className="text-[#C9A84C] font-serif">₹{testResult.discount?.toFixed(0)}</span></p>
                        <p>Final Amount: <span className="text-green-400 font-serif">₹{testResult.finalAmount?.toFixed(0)}</span></p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AVAILABLE COUPONS */}
            <div className="space-y-3">
              <h3 className="font-serif text-xl text-white mb-4">Available Coupons</h3>
              {loading ? (
                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-[#111318] animate-pulse" />)}</div>
              ) : coupons.filter(c => c.active).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="luxury-card p-4 border-dashed"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-[#C9A84C] text-lg tracking-widest">{c.code}</span>
                      <p className="text-[#E8E0D0]/40 text-xs mt-1 tracking-wide">{c.discountPercent}% off · Max ₹{c.maxDiscount}</p>
                      <p className="text-[#E8E0D0]/25 text-[10px] tracking-wider mt-0.5">Expires: {c.expiryDate} · {c.usedCount}/{c.usageLimit} used</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl text-[#C9A84C]">{c.discountPercent}%</span>
                      <p className="text-[#E8E0D0]/25 text-[10px] tracking-widest uppercase">OFF</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: CREATE COUPON (MANAGER) */}
          {role === "MANAGER" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="luxury-card p-6 mb-6">
                <h2 className="font-serif text-2xl text-white mb-5 flex items-center gap-3">
                  <FaPlus className="text-[#C9A84C]" /> Create Coupon
                </h2>
                <form onSubmit={createCoupon} className="space-y-4">
                  {[
                    { key: "code", label: "Coupon Code", placeholder: "SAVE20", icon: <FaTag /> },
                    { key: "discountPercent", label: "Discount %", placeholder: "20", type: "number", icon: <FaPercent /> },
                    { key: "maxDiscount", label: "Max Discount (₹)", placeholder: "500", type: "number", icon: <FaTag /> },
                    { key: "usageLimit", label: "Usage Limit", placeholder: "100", type: "number", icon: <FaUsers /> },
                  ].map(({ key, label, placeholder, type = "text", icon }) => (
                    <div key={key}>
                      <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">{label}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs">{icon}</span>
                        <input
                          type={type} placeholder={placeholder} required
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="luxury-input w-full pl-10 pr-4 py-3 text-sm uppercase"
                        />
                      </div>
                    </div>
                  ))}
                  <div>
                    <label className="text-[#E8E0D0]/50 text-[10px] tracking-[0.2em] uppercase mb-2 block">Expiry Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/50 text-xs" />
                      <input
                        type="date" min={today} required
                        value={form.expiryDate}
                        onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                        className="luxury-input w-full pl-10 pr-4 py-3 text-sm [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={adding}
                    className="btn-gold w-full py-3 disabled:opacity-50"
                  >
                    <span>{adding ? "Creating..." : "Create Coupon"}</span>
                  </motion.button>
                </form>
              </div>

              {/* ALL COUPONS TABLE */}
              <div>
                <h3 className="font-serif text-xl text-white mb-4">All Coupons</h3>
                <div className="luxury-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full luxury-table">
                      <thead>
                        <tr className="border-b border-[#C9A84C]/10 bg-[#111318]">
                          <th className="p-4 text-left">Code</th>
                          <th className="p-4 text-left">Discount</th>
                          <th className="p-4 text-left">Used</th>
                          <th className="p-4 text-left">Status</th>
                          <th className="p-4 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map(c => (
                          <tr key={c.id} className="border-b border-[#C9A84C]/5 hover:bg-[#C9A84C]/3 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#C9A84C] text-sm">{c.code}</td>
                            <td className="p-4 text-[#E8E0D0]/50 text-xs">{c.discountPercent}%</td>
                            <td className="p-4 text-[#E8E0D0]/40 text-xs">{c.usedCount}/{c.usageLimit}</td>
                            <td className="p-4">
                              <span className={`text-[10px] px-3 py-1 tracking-widest uppercase ${c.active ? "badge-success" : "badge-danger"}`}>
                                {c.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="p-4">
                              <button onClick={() => deleteCoupon(c.id)} className="text-[#E8E0D0]/25 hover:text-red-400 transition-colors">
                                <FaTrash size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
