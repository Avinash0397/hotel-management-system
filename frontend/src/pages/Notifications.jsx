import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell, FaCheckDouble, FaTrash, FaCalendarCheck,
  FaCreditCard, FaCog, FaGift, FaCircle
} from "react-icons/fa";

const TYPE_CONFIG = {
  BOOKING: { icon: <FaCalendarCheck />, color: "text-blue-400", border: "border-blue-500/20" },
  PAYMENT: { icon: <FaCreditCard />, color: "text-green-400", border: "border-green-500/20" },
  SYSTEM:  { icon: <FaCog />, color: "text-[#E8E0D0]/40", border: "border-[#C9A84C]/10" },
  PROMO:   { icon: <FaGift />, color: "text-[#C9A84C]", border: "border-[#C9A84C]/20" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const load = async () => {
    try { setLoading(true); const res = await api.get("/notifications"); setNotifications(res.data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === "ALL" ? notifications
    : filter === "UNREAD" ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const filters = ["ALL", "UNREAD", "BOOKING", "PAYMENT", "PROMO", "SYSTEM"];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E8E0D0] pt-28 px-6 pb-20">
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="section-label mb-3">Inbox</p>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-serif text-5xl text-white font-semibold mb-2 flex items-center gap-4">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full align-middle">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <div className="gold-divider-left mt-4" />
              <p className="text-[#E8E0D0]/30 text-xs tracking-wide mt-3">{notifications.length} total · {unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={markAllRead}
                className="btn-ghost px-5 py-2.5 flex items-center gap-2"
              >
                <FaCheckDouble size={11} /> Mark all read
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* FILTER TABS */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition-all ${
                filter === f
                  ? "bg-[#C9A84C] text-[#0D1117]"
                  : "border border-[#C9A84C]/20 text-[#E8E0D0]/40 hover:border-[#C9A84C]/40 hover:text-[#E8E0D0]/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-[#111318] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 luxury-card">
            <FaBell className="text-[#C9A84C]/15 text-6xl mx-auto mb-4" />
            <p className="font-serif text-3xl text-[#E8E0D0]/20 mb-2">No Notifications</p>
            <p className="text-[#E8E0D0]/20 text-xs tracking-widest uppercase">You're all caught up</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map((n, i) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !n.read && markRead(n.id)}
                    className={`luxury-card p-4 cursor-pointer ${n.read ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 border ${cfg.border} flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${n.read ? "text-[#E8E0D0]/40" : "text-white"}`}>{n.title}</p>
                          {!n.read && <FaCircle className="text-[#C9A84C] flex-shrink-0" size={6} />}
                        </div>
                        <p className={`text-xs mt-1 ${n.read ? "text-[#E8E0D0]/25" : "text-[#E8E0D0]/50"}`}>{n.message}</p>
                        <p className="text-[#E8E0D0]/20 text-[10px] tracking-wider mt-1">
                          {new Date(n.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="text-[#E8E0D0]/20 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
