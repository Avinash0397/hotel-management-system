import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaMoneyBillWave, FaHotel, FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "MANAGER") { loadAllBookings(); loadPayments(); }
    if (user?.role === "CUSTOMER") loadMyBookings();
  }, [user]);

  const loadAllBookings = async () => {
    try { setLoading(true); const res = await api.get("/bookings/all"); setBookings(res.data); }
    catch { } finally { setLoading(false); }
  };

  const loadMyBookings = async () => {
    try { setLoading(true); const res = await api.get("/bookings/my"); setBookings(res.data); }
    catch { } finally { setLoading(false); }
  };

  const loadPayments = async () => {
    try { const res = await api.get("/payments/all"); setPayments(res.data); } catch { }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      loadMyBookings();
    } catch { alert("Failed to cancel booking"); }
  };

  const cancelBookingAsManager = async (id) => {
    if (!window.confirm("Cancel this booking as manager?")) return;
    try {
      await api.delete(`/bookings/${id}/force`);
      loadAllBookings();
    } catch { alert("Failed to cancel booking"); }
  };

  const totalRevenue = payments.reduce((sum, p) => p.status === "SUCCESS" ? sum + p.amount : sum, 0);
  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;

  const stats = user?.role === "MANAGER"
    ? [
        { label: "Total Bookings", value: bookings.length, icon: <FaCalendarCheck />, color: "from-blue-500 to-blue-600" },
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <FaMoneyBillWave />, color: "from-amber-500 to-amber-600" },
        { label: "Confirmed", value: confirmedCount, icon: <FaCheckCircle />, color: "from-green-500 to-green-600" },
        { label: "Cancelled", value: cancelledCount, icon: <FaTimesCircle />, color: "from-red-500 to-red-600" },
      ]
    : [
        { label: "My Bookings", value: bookings.length, icon: <FaCalendarCheck />, color: "from-blue-500 to-blue-600" },
        { label: "Confirmed", value: confirmedCount, icon: <FaCheckCircle />, color: "from-green-500 to-green-600" },
        { label: "Pending", value: bookings.filter(b => b.status === "CREATED").length, icon: <FaClock />, color: "from-amber-500 to-amber-600" },
        { label: "Cancelled", value: cancelledCount, icon: <FaTimesCircle />, color: "from-red-500 to-red-600" },
      ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-14">
          <p className="section-label mb-3">Overview</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-2">Dashboard</h1>
          <div className="gold-divider-left mt-4 mb-3" />
          <p className="text-[#E8E0D0]/40 text-xs tracking-wide">
            Welcome, <span className="text-[#C9A84C]">{user?.email}</span>
            <span className="ml-3 text-[10px] border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-0.5 tracking-widest uppercase">
              {user?.role}
            </span>
          </p>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="luxury-card p-6"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <p className="font-serif text-2xl text-white mb-1">{stat.value}</p>
              <p className="text-[#E8E0D0]/40 text-[10px] tracking-[0.15em] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* MANAGER: PAYMENTS TABLE */}
        {user?.role === "MANAGER" && payments.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-10">
            <h2 className="font-serif text-2xl text-white mb-5 flex items-center gap-3">
              <FaMoneyBillWave className="text-[#C9A84C]" /> Payment Records
            </h2>
            <div className="luxury-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full luxury-table">
                  <thead>
                    <tr className="border-b border-[#C9A84C]/10 bg-[#111318]">
                      <th className="p-4 text-left">Payment ID</th>
                      <th className="p-4 text-left">Booking ID</th>
                      <th className="p-4 text-left">Amount</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p.id} className="border-b border-[#C9A84C]/5 hover:bg-[#C9A84C]/3 transition-colors">
                        <td className="p-4 text-xs text-[#E8E0D0]/30 font-mono">{p.id?.slice(0, 8)}...</td>
                        <td className="p-4 text-xs text-[#E8E0D0]/30 font-mono">{p.bookingId?.slice(0, 8)}...</td>
                        <td className="p-4 text-[#C9A84C] font-serif">₹{p.amount?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`text-[10px] px-3 py-1 tracking-widest uppercase ${p.status === "SUCCESS" ? "badge-success" : p.status === "FAILED" ? "badge-danger" : "badge-warning"}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* BOOKINGS TABLE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="font-serif text-2xl text-white mb-5 flex items-center gap-3">
            <FaCalendarCheck className="text-[#C9A84C]" />
            {user?.role === "MANAGER" ? "All Bookings" : "My Bookings"}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-[#111318] animate-pulse" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 luxury-card">
              <p className="font-serif text-4xl text-[#E8E0D0]/20 mb-3">No Bookings Found</p>
              <p className="text-[#E8E0D0]/25 text-xs tracking-widest uppercase">Your reservations will appear here</p>
            </div>
          ) : (
            <div className="luxury-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full luxury-table">
                  <thead>
                    <tr className="border-b border-[#C9A84C]/10 bg-[#111318]">
                      <th className="p-4 text-left">Booking ID</th>
                      {user?.role === "MANAGER" && <th className="p-4 text-left">Guest</th>}
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Check-in</th>
                      <th className="p-4 text-left">Check-out</th>
                      <th className="p-4 text-left">Total</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id} className="border-b border-[#C9A84C]/5 hover:bg-[#C9A84C]/3 transition-colors">
                        <td className="p-4 text-xs text-[#E8E0D0]/30 font-mono">{b.id?.slice(0, 8)}...</td>
                        {user?.role === "MANAGER" && <td className="p-4 text-[#E8E0D0]/60 text-xs">{b.userEmail}</td>}
                        <td className="p-4">
                          <span className={`text-[10px] px-3 py-1 tracking-widest uppercase ${b.status === "CONFIRMED" ? "badge-success" : b.status === "CANCELLED" ? "badge-danger" : "badge-warning"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-[#E8E0D0]/50 text-xs">{b.checkIn}</td>
                        <td className="p-4 text-[#E8E0D0]/50 text-xs">{b.checkOut}</td>
                        <td className="p-4 text-[#C9A84C] font-serif text-sm">₹{b.totalPrice?.toLocaleString()}</td>
                        <td className="p-4">
                          {user?.role === "CUSTOMER" && (b.status === "CREATED" || b.status === "CONFIRMED") && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => cancelBooking(b.id)}
                              className="badge-danger px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all hover:bg-red-500/20"
                            >
                              Cancel
                            </motion.button>
                          )}
                          {user?.role === "MANAGER" && b.status !== "CANCELLED" && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => cancelBookingAsManager(b.id)}
                              className="badge-danger px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all hover:bg-red-500/20"
                            >
                              Cancel
                            </motion.button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
