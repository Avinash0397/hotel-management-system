import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaBars, FaTimes, FaBell, FaTag,
  FaChartBar, FaHotel, FaTachometerAlt, FaUser, FaSignOutAlt, FaUserCircle
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (user) {
      api.get("/notifications/unread-count")
        .then(res => setUnreadCount(res.data.count || 0))
        .catch(() => {});
    }
  }, [user]);

  const navLinks = [
    { label: "Hotels", path: "/hotels" },
    { label: "Offers", path: "/coupons" },
    ...(user?.role === "MANAGER" ? [{ label: "Analytics", path: "/analytics" }] : []),
  ];

  const dropVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#C9A84C]/20 shadow-2xl"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        {/* LOGO */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 border border-[#C9A84C]/60 flex items-center justify-center">
            <FaHotel className="text-[#C9A84C] text-sm" />
          </div>
          <div>
            <span className="font-serif text-xl font-semibold tracking-widest text-[#E8C97A]">
              THE GRAND
            </span>
            <span className="block text-[0.55rem] tracking-[0.35em] text-[#C9A84C]/70 uppercase font-sans -mt-0.5">
              Luxury Collection
            </span>
          </div>
        </motion.div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#C9A84C] text-xl"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <motion.button
              key={link.path}
              whileHover={{ y: -1 }}
              onClick={() => navigate(link.path)}
              className="text-[#E8E0D0]/80 hover:text-[#E8C97A] transition-colors text-xs tracking-[0.18em] uppercase font-sans font-medium relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300" />
            </motion.button>
          ))}

          {user ? (
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/notifications")}
                className="relative text-[#E8E0D0]/60 hover:text-[#E8C97A] transition-colors"
              >
                <FaBell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.button>

              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 border border-[#C9A84C]/30 px-4 py-2 hover:border-[#C9A84C]/60 transition-all"
                >
                  <FaUserCircle size={16} className="text-[#C9A84C]" />
                  <span className="text-[#E8E0D0]/80 text-xs tracking-wider max-w-24 truncate font-sans">
                    {user.email?.split("@")[0]}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      variants={dropVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 bg-[#111318] border border-[#C9A84C]/20 shadow-2xl w-56 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#C9A84C]/10">
                        <p className="text-[#E8E0D0] text-xs font-medium truncate">{user.email}</p>
                        <span className="text-[10px] text-[#C9A84C] tracking-widest uppercase mt-1 inline-block">
                          {user.role}
                        </span>
                      </div>
                      {[
                        { label: "My Account", icon: <FaUser size={11} />, path: "/account" },
                        { label: "Dashboard", icon: <FaTachometerAlt size={11} />, path: "/dashboard" },
                        { label: "Notifications", icon: <FaBell size={11} />, path: "/notifications", badge: unreadCount },
                      ].map(item => (
                        <motion.button
                          key={item.path}
                          whileHover={{ backgroundColor: "rgba(201,168,76,0.06)" }}
                          onClick={() => { navigate(item.path); setOpen(false); }}
                          className="w-full px-4 py-3 text-left text-[#E8E0D0]/70 hover:text-[#E8C97A] transition-colors flex items-center gap-3 text-xs tracking-wider"
                        >
                          <span className="text-[#C9A84C]">{item.icon}</span>
                          {item.label}
                          {item.badge > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(239,68,68,0.06)" }}
                        onClick={() => { logout(); navigate("/login"); setOpen(false); }}
                        className="w-full px-4 py-3 text-left text-red-400/70 hover:text-red-400 transition-colors border-t border-[#C9A84C]/10 flex items-center gap-3 text-xs tracking-wider"
                      >
                        <FaSignOutAlt size={11} /> Sign Out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="btn-gold px-6 py-2.5"
            >
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-0 right-0 bg-[#0D1117]/98 backdrop-blur-xl md:hidden border-b border-[#C9A84C]/15 shadow-2xl"
            >
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setMenuOpen(false); }}
                  className="w-full px-6 py-4 text-left text-[#E8E0D0]/70 hover:text-[#E8C97A] hover:bg-[#C9A84C]/5 transition-colors text-xs tracking-[0.2em] uppercase border-b border-[#C9A84C]/5"
                >
                  {link.label}
                </button>
              ))}
              {user ? (
                <>
                  <button onClick={() => { navigate("/notifications"); setMenuOpen(false); }}
                    className="w-full px-6 py-4 text-left text-[#E8E0D0]/70 hover:text-[#E8C97A] hover:bg-[#C9A84C]/5 transition-colors text-xs tracking-[0.2em] uppercase border-b border-[#C9A84C]/5 flex items-center gap-3"
                  >
                    <FaBell size={12} className="text-[#C9A84C]" /> Notifications
                    {unreadCount > 0 && <span className="ml-auto bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </button>
                  <button onClick={() => { navigate("/account"); setMenuOpen(false); }}
                    className="w-full px-6 py-4 text-left text-[#E8E0D0]/70 hover:text-[#E8C97A] hover:bg-[#C9A84C]/5 transition-colors text-xs tracking-[0.2em] uppercase border-b border-[#C9A84C]/5"
                  >
                    My Account
                  </button>
                  <button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                    className="w-full px-6 py-4 text-left text-[#E8E0D0]/70 hover:text-[#E8C97A] hover:bg-[#C9A84C]/5 transition-colors text-xs tracking-[0.2em] uppercase border-b border-[#C9A84C]/5"
                  >
                    Dashboard
                  </button>
                  <button onClick={() => { logout(); navigate("/login"); setMenuOpen(false); }}
                    className="w-full px-6 py-4 text-left text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors text-xs tracking-[0.2em] uppercase"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="w-full px-6 py-4 btn-gold text-center text-xs tracking-[0.2em] uppercase"
                >
                  <span>Sign In</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
