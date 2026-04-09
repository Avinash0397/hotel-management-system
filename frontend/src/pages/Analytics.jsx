import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  FaChartBar, FaMoneyBillWave, FaCalendarCheck,
  FaCheckCircle, FaTimesCircle, FaClock, FaHotel, FaTrophy
} from "react-icons/fa";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sumRes, monRes, topRes] = await Promise.all([
          api.get("/reports/summary"),
          api.get("/reports/monthly"),
          api.get("/reports/top-hotels")
        ]);
        setSummary(sumRes.data);
        setMonthly(monRes.data);
        setTopHotels(topRes.data);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);
  const maxHotelRevenue = Math.max(...topHotels.map(h => h.revenue), 1);

  const statCards = summary ? [
    { label: "Total Bookings", value: summary.totalBookings, icon: <FaCalendarCheck />, color: "from-blue-500 to-blue-600" },
    { label: "Total Revenue", value: `₹${Number(summary.totalRevenue).toLocaleString()}`, icon: <FaMoneyBillWave />, color: "from-amber-500 to-amber-600" },
    { label: "Confirmed", value: summary.confirmed, icon: <FaCheckCircle />, color: "from-green-500 to-green-600" },
    { label: "Cancelled", value: summary.cancelled, icon: <FaTimesCircle />, color: "from-red-500 to-red-600" },
    { label: "Pending", value: summary.pending, icon: <FaClock />, color: "from-yellow-500 to-yellow-600" },
    { label: "Avg/Booking", value: summary.totalBookings > 0 ? `₹${Math.round(summary.totalRevenue / summary.totalBookings).toLocaleString()}` : "₹0", icon: <FaChartBar />, color: "from-purple-500 to-purple-600" },
  ] : [];

  if (loading) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="w-8 h-8 border border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-14">
          <p className="section-label mb-3">Reports</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-2">Analytics</h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/30 text-xs tracking-wide">Real-time business intelligence dashboard</p>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="luxury-card p-5"
            >
              <div className={`w-9 h-9 bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 text-sm`}>
                {s.icon}
              </div>
              <p className="font-serif text-xl text-white mb-1">{s.value}</p>
              <p className="text-[#E8E0D0]/30 text-[10px] tracking-[0.15em] uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* MONTHLY REVENUE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="luxury-card p-6"
          >
            <h2 className="font-serif text-2xl text-white mb-6 flex items-center gap-3">
              <FaChartBar className="text-[#C9A84C]" /> Monthly Revenue
            </h2>
            <div className="flex items-end gap-2 h-48">
              {monthly.map((m, i) => {
                const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex items-end justify-center" style={{ height: "160px" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(pct, 2)}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                        className="w-full bg-gradient-to-t from-[#9A7A2E] to-[#E8C97A] relative group-hover:from-[#C9A84C] group-hover:to-[#E8C97A] transition-all"
                        style={{ minHeight: "4px" }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111318] border border-[#C9A84C]/20 text-[#C9A84C] text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                          ₹{m.revenue.toLocaleString()}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[#E8E0D0]/30 text-[10px] tracking-wider">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* TOP HOTELS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="luxury-card p-6"
          >
            <h2 className="font-serif text-2xl text-white mb-6 flex items-center gap-3">
              <FaTrophy className="text-[#C9A84C]" /> Top Revenue Hotels
            </h2>
            {topHotels.length === 0 ? (
              <div className="text-center py-10">
                <FaHotel className="text-[#C9A84C]/15 text-5xl mx-auto mb-3" />
                <p className="text-[#E8E0D0]/25 text-xs tracking-widest uppercase">No data yet</p>
              </div>
            ) : (
              <div className="space-y-5">
                {topHotels.map((h, i) => {
                  const pct = (h.revenue / maxHotelRevenue) * 100;
                  const medals = ["🥇", "🥈", "🥉", "4", "5"];
                  return (
                    <div key={h.hotelId}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#E8E0D0]/50 text-xs flex items-center gap-2">
                          <span>{medals[i]}</span>
                          <span className="font-mono text-[#E8E0D0]/30">{h.hotelId.slice(0, 8)}...</span>
                        </span>
                        <span className="text-[#C9A84C] font-serif text-sm">₹{h.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-[#111318] h-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                          className="h-0.5 bg-gradient-to-r from-[#9A7A2E] to-[#E8C97A]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* BOOKING STATUS */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="luxury-card p-6 md:col-span-2"
            >
              <h2 className="font-serif text-2xl text-white mb-8 flex items-center gap-3">
                <FaCalendarCheck className="text-[#C9A84C]" /> Booking Status Breakdown
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Confirmed", value: summary.confirmed, total: summary.totalBookings, stroke: "#22c55e", textColor: "text-green-400" },
                  { label: "Cancelled", value: summary.cancelled, total: summary.totalBookings, stroke: "#ef4444", textColor: "text-red-400" },
                  { label: "Pending", value: summary.pending, total: summary.totalBookings, stroke: "#C9A84C", textColor: "text-[#C9A84C]" },
                ].map((s, i) => {
                  const pct = s.total > 0 ? Math.round((s.value / s.total) * 100) : 0;
                  return (
                    <div key={i} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#111318" strokeWidth="2" />
                          <motion.circle
                            cx="18" cy="18" r="15.9" fill="none"
                            stroke={s.stroke}
                            strokeWidth="2"
                            strokeDasharray={`${pct} ${100 - pct}`}
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${pct} ${100 - pct}` }}
                            transition={{ delay: 0.7 + i * 0.1, duration: 1 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`font-serif text-xl ${s.textColor}`}>{pct}%</span>
                        </div>
                      </div>
                      <p className="text-white text-sm tracking-wide">{s.label}</p>
                      <p className="text-[#E8E0D0]/30 text-xs tracking-wider mt-1">{s.value} bookings</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
