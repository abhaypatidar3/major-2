import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaRobot, FaArrowRight } from "react-icons/fa";
import "../css/home.css";

const features = [
  {
    to: "/period-calculator",
    icon: "fa-solid fa-calendar-days",
    title: "Period Calculator",
    desc: "Track your cycle with ease and accuracy. Get predictions for your next period and ovulation days.",
    tag: "Tracker",
    color: "card-purple",
    img: "/images/Menstrual-cycle.jpeg",
  },
  {
    to: "/symptoms",
    icon: "fa-solid fa-stethoscope",
    title: "Symptom Solutions",
    desc: "Find holistic remedies, yoga poses, diet tips and herbal treatments tailored to your symptoms.",
    tag: "Wellness",
    color: "card-pink",
    img: "/images/symptom-intro.jpeg",
  },
  {
    to: "/education",
    icon: "fa-solid fa-book-open",
    title: "Health Education",
    desc: "Articles, videos, FAQs and facts to keep you informed about menstrual health and hygiene.",
    tag: "Learn",
    color: "card-violet",
    img: "/images/education-intro.jpg",
  },
  {
    to: "/community",
    icon: "fa-solid fa-users",
    title: "Community",
    desc: "Connect, share experiences and support each other. Your safe space for open conversations.",
    tag: "Coming Soon",
    color: "card-rose",
    img: "/images/community-intro.jpg",
  },
];


const Home = () => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  // Hydration popup logic
  useEffect(() => {
    const check = () => {
      const last = localStorage.getItem("lastAlertTime");
      const now = Date.now();
      if (!last || now - last >= 2 * 60 * 60 * 1000) {
        setShowPopup(true);
        localStorage.setItem("lastAlertTime", now);
      }
    };
    check();
    const id = setInterval(check, 60 * 10);
    return () => clearInterval(id);
  }, []);

  // Staggered card entrance
  useEffect(() => {
    features.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, i]);
      }, 200 + i * 150);
    });
  }, []);

  const firstName = user?.firstname || "there";

  return (
    <div className="home-page">

      {/* ── Hero Banner ── */}
      <div className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <div className="home-greeting-pill">
            <i className="fa-solid fa-sparkles" />
            &nbsp;Good to see you back
          </div>
          <h1 className="home-hero-title">
            Hello, <span className="home-hero-name">{firstName}</span> 👋
          </h1>
          <p className="home-hero-subtitle">
            Your companion in menstrual health &amp; wellness.<br />
            What would you like to explore today?
          </p>
          <div className="home-hero-quote">
            <i className="fa-solid fa-quote-left" />
            &nbsp;Empowering women through knowledge, community, and care.&nbsp;
            <i className="fa-solid fa-quote-right" />
          </div>
        </div>

        {/* AI Nurse CTA */}
        <Link to="/syncora-ai" className="hero-ai-cta">
          <div className="hero-ai-icon">
            <FaRobot />
          </div>
          <div className="hero-ai-text">
            <span className="hero-ai-label">Talk to</span>
            <span className="hero-ai-name">SyncoraAI</span>
          </div>
          <FaArrowRight className="hero-ai-arrow" />
        </Link>

        {/* Floating decorative circles */}
        <div className="hero-circle hero-c1" />
        <div className="hero-circle hero-c2" />
        <div className="hero-circle hero-c3" />
      </div>

      {/* ── Section heading ── */}
      <div className="home-section-heading">
        <h2>Explore Features</h2>
        <p>Everything you need to understand and manage your health in one place</p>
      </div>

      {/* ── Feature Cards ── */}
      <div className="home-cards-grid">
        {features.map((f, i) => (
          <Link
            to={f.to}
            key={i}
            className={`hcard ${f.color} ${visibleCards.includes(i) ? "hcard-visible" : ""}`}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {/* Card image */}
            <div className="hcard-img-wrap">
              <img src={f.img} alt={f.title} className="hcard-img" />
              <div className="hcard-img-overlay" />
              <span className="hcard-tag">{f.tag}</span>
            </div>

            {/* Card body */}
            <div className="hcard-body">
              <div className="hcard-icon-wrap">
                <i className={f.icon} />
              </div>
              <h3 className="hcard-title">{f.title}</h3>
              <p className="hcard-desc">{f.desc}</p>
              <div className="hcard-cta">
                Explore <i className="fa-solid fa-arrow-right" />
              </div>
            </div>

            {/* Shine sweep on hover */}
            <div className="hcard-shine" />
          </Link>
        ))}
      </div>

      {/* ── Motivation Banner ── */}
      <div className="home-motivation">
        <div className="motivation-content">
          <i className="fa-solid fa-heart-pulse motivation-icon" />
          <div>
            <h3>Your Health Matters</h3>
            <p>Every cycle is a step toward understanding your body better. You&apos;re doing great!</p>
          </div>
        </div>
        <Link to="/education" className="motivation-cta">
          Learn More &nbsp;<i className="fa-solid fa-arrow-right" />
        </Link>
      </div>

      {/* ── Hydration Popup ── */}
      {showPopup && (
        <div className="hydration-overlay" onClick={() => setShowPopup(false)}>
          <div className="hydration-popup" onClick={(e) => e.stopPropagation()}>
            <div className="hydration-icon">💧</div>
            <h4>Stay Hydrated!</h4>
            <p>Drinking water regularly helps reduce period cramps and bloating. Have a glass now!</p>
            <button onClick={() => setShowPopup(false)} className="hydration-btn">
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
