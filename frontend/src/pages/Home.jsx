import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar, FaAward, FaConciergeBell, FaShieldAlt, FaChevronDown, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90",
    title: "Where Luxury",
    titleItalic: "Meets Legacy",
    sub: "An unparalleled experience of grandeur and grace"
  },
  {
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90",
    title: "Timeless",
    titleItalic: "Elegance",
    sub: "Curated stays that transcend the ordinary"
  },
  {
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=90",
    title: "The Art of",
    titleItalic: "Hospitality",
    sub: "Every detail crafted for your perfect sojourn"
  }
];

const DESTINATIONS = [
  { city: "Mumbai", tag: "City of Dreams", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", hotels: "2,500+ Properties" },
  { city: "Jaipur", tag: "Pink City", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", hotels: "1,800+ Properties" },
  { city: "Goa", tag: "Pearl of the Orient", img: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c7?w=800&q=80", hotels: "3,200+ Properties" },
  { city: "Udaipur", tag: "City of Lakes", img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", hotels: "1,100+ Properties" },
];

const EXPERIENCES = [
  { icon: <FaConciergeBell size={22} />, title: "Butler Service", desc: "Dedicated personal butler available around the clock for every need" },
  { icon: <FaAward size={22} />, title: "Award-Winning Dining", desc: "Michelin-starred restaurants and curated culinary journeys" },
  { icon: <FaShieldAlt size={22} />, title: "Guaranteed Excellence", desc: "Best rate guarantee with our exclusive member privileges" },
];

const TESTIMONIALS = [
  { name: "Arjun Mehta", title: "Frequent Traveller", review: "An experience that redefines luxury. The attention to detail is simply extraordinary.", rating: 5 },
  { name: "Priya Sharma", title: "Honeymooner", review: "Our anniversary stay was nothing short of magical. Every moment was perfection.", rating: 5 },
  { name: "Vikram Nair", title: "Business Executive", review: "The seamless blend of modern amenities with timeless elegance is unmatched.", rating: 5 },
];

function GoldDivider({ className = "" }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`gold-divider ${className}`}
    />
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    navigate(searchQuery.trim() ? `/hotels?search=${encodeURIComponent(searchQuery.trim())}` : "/hotels");
  };

  return (
    <div className="bg-[#0D1117] text-[#E8E0D0] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* PARALLAX BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 hero-parallax">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide}
              src={HERO_SLIDES[slide].img}
              alt=""
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </motion.div>

        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/30 via-[#0D1117]/20 to-[#0D1117]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/50 to-transparent" />

        {/* CONTENT */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="section-label mb-6"
          >
            ✦ &nbsp; The Grand Luxury Collection &nbsp; ✦
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="font-serif text-6xl md:text-8xl font-semibold text-white leading-tight">
                {HERO_SLIDES[slide].title}
                <br />
                <em className="gold-text not-italic">{HERO_SLIDES[slide].titleItalic}</em>
              </h1>
              <p className="mt-4 text-[#E8E0D0]/60 text-lg md:text-xl font-display font-light tracking-wide">
                {HERO_SLIDES[slide].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          <GoldDivider className="mb-8" />

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-0 w-full max-w-xl border border-[#C9A84C]/30 bg-[#0D1117]/60 backdrop-blur-md"
          >
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Destination, hotel or city..."
              className="flex-1 px-6 py-4 bg-transparent text-[#E8E0D0] placeholder-[#E8E0D0]/30 text-sm tracking-wide focus:outline-none border-r border-[#C9A84C]/20"
            />
            <motion.button
              whileHover={{ backgroundColor: "#E8C97A" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="btn-gold px-8 py-4 flex items-center gap-2"
            >
              <span className="flex items-center gap-2"><FaSearch size={12} /> Search</span>
            </motion.button>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/hotels")}
              className="btn-gold px-8 py-3"
            >
              <span>Explore Hotels</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="btn-ghost px-8 py-3"
            >
              Become a Member
            </motion.button>
          </motion.div>

          {/* SLIDE DOTS */}
          <div className="flex gap-2 mt-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`transition-all duration-300 ${i === slide ? "w-8 h-0.5 bg-[#C9A84C]" : "w-2 h-0.5 bg-[#C9A84C]/30"}`}
              />
            ))}
          </div>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#C9A84C]/50"
        >
          <FaChevronDown size={16} />
        </motion.div>
      </section>

      {/* ═══════════════ STATS STRIP ═══════════════ */}
      <section className="py-16 border-y border-[#C9A84C]/10 bg-[#111318]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            { number: "10,000+", label: "Luxury Properties" },
            { number: "1M+", label: "Discerning Guests" },
            { number: "500+", label: "Destinations" },
            { number: "24 / 7", label: "Concierge Support" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <p className="font-serif text-3xl md:text-4xl gold-text font-semibold mb-1">{s.number}</p>
              <p className="text-[#E8E0D0]/40 text-xs tracking-[0.2em] uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ EXPERIENCES ═══════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="section-label mb-4">Our Promise</p>
            <h2 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-4">
              The <em className="gold-text not-italic">Grand</em> Experience
            </h2>
            <GoldDivider className="mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                whileHover={{ y: -6 }}
                className="luxury-card p-10 text-center group"
              >
                <div className="w-14 h-14 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6 text-[#C9A84C] group-hover:border-[#C9A84C]/70 transition-all duration-300">
                  {exp.icon}
                </div>
                <h3 className="font-serif text-xl text-white mb-3 group-hover:text-[#E8C97A] transition-colors">{exp.title}</h3>
                <div className="gold-divider mb-4" />
                <p className="text-[#E8E0D0]/50 text-sm leading-relaxed">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DESTINATIONS ═══════════════ */}
      <section className="py-28 px-6 bg-[#111318]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="section-label mb-4">Curated Destinations</p>
            <h2 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-4">
              Iconic <em className="gold-text not-italic">Addresses</em>
            </h2>
            <GoldDivider className="mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                onClick={() => navigate("/hotels")}
                className="relative group overflow-hidden cursor-pointer h-80"
              >
                <img
                  src={dest.img}
                  alt={dest.city}
                  className="w-full h-full object-cover img-zoom"
                />
                <div className="absolute inset-0 overlay-bottom" />
                <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/5 transition-all duration-500" />

                {/* BORDER REVEAL */}
                <div className="absolute inset-3 border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/40 transition-all duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="section-label mb-1">{dest.tag}</p>
                  <h3 className="font-serif text-4xl text-white font-semibold mb-1">{dest.city}</h3>
                  <p className="text-[#C9A84C] text-xs tracking-widest">{dest.hotels}</p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40px" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="h-px bg-[#C9A84C] mt-3"
                  />
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="btn-ghost text-[10px] px-4 py-2 tracking-widest">Explore →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="section-label mb-4">Guest Stories</p>
            <h2 className="font-serif text-5xl md:text-6xl text-white font-semibold mb-4">
              Voices of <em className="gold-text not-italic">Distinction</em>
            </h2>
            <GoldDivider className="mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="luxury-card p-8"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} size={12} className="text-[#C9A84C]" />
                  ))}
                </div>
                <p className="font-display text-lg text-[#E8E0D0]/80 leading-relaxed mb-6 italic">
                  "{t.review}"
                </p>
                <div className="border-t border-[#C9A84C]/10 pt-5">
                  <p className="font-serif text-white text-sm">{t.name}</p>
                  <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase mt-0.5">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80)" }}
        />
        <div className="absolute inset-0 bg-[#0D1117]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/60 to-[#0D1117]/40" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <p className="section-label mb-6">Begin Your Journey</p>
          <h2 className="font-serif text-5xl md:text-7xl text-white font-semibold mb-4 leading-tight">
            Reserve Your <em className="gold-text not-italic">Perfect</em> Stay
          </h2>
          <GoldDivider className="my-8" />
          <p className="text-[#E8E0D0]/60 text-lg font-display font-light mb-10">
            Join millions of discerning travellers who trust The Grand for their most cherished moments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/hotels")}
              className="btn-gold px-10 py-4"
            >
              <span>Discover Hotels</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="btn-ghost px-10 py-4"
            >
              Join The Grand Club
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-[#080B0F] border-t border-[#C9A84C]/10 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 border border-[#C9A84C]/50 flex items-center justify-center">
                  <span className="text-[#C9A84C] text-xs">✦</span>
                </div>
                <span className="font-serif text-lg text-[#E8C97A] tracking-widest">THE GRAND</span>
              </div>
              <p className="text-[#E8E0D0]/35 text-xs leading-relaxed mb-6">
                A legacy of luxury hospitality spanning decades, crafting unforgettable experiences across India's most iconic destinations.
              </p>
              <div className="flex gap-4">
                {[FaInstagram, FaTwitter, FaLinkedin].map((Icon, i) => (
                  <motion.a key={i} whileHover={{ y: -2, color: "#C9A84C" }} href="#"
                    className="text-[#E8E0D0]/30 hover:text-[#C9A84C] transition-colors">
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              { title: "Destinations", links: ["Mumbai", "Jaipur", "Goa", "Udaipur", "Delhi"] },
              { title: "Services", links: ["Luxury Stays", "Dining", "Spa & Wellness", "Events", "Concierge"] },
              { title: "Company", links: ["About Us", "Careers", "Press", "Privacy Policy", "Terms"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-5 font-sans">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[#E8E0D0]/35 hover:text-[#E8C97A] transition-colors text-xs tracking-wide">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#C9A84C]/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#E8E0D0]/20 text-xs tracking-widest">
              © 2026 The Grand Luxury Collection. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-px bg-[#C9A84C]/30" />
              <span className="text-[#C9A84C]/40 text-[10px] tracking-[0.3em] uppercase">Crafted with Excellence</span>
              <div className="w-4 h-px bg-[#C9A84C]/30" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
