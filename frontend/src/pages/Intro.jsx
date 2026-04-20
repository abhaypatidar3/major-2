import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaCalendarCheck,
  FaHeartbeat,
  FaUsers,
  FaBook,
  FaArrowRight,
} from "react-icons/fa";
import "../css/intro.css";

const features = [
  {
    img: "/images/Menstrual-cycle.jpeg",
    title: "Period Calculator",
    desc: "Predict your cycle with smart precision and personalised daily insights.",
    icon: <FaCalendarCheck />,
    tag: "Tracking",
    color: "card-purple",
  },
  {
    img: "/images/symptom-intro.jpeg",
    title: "Symptom Solutions",
    desc: "Get science-backed remedies tailored to your unique symptoms and body.",
    icon: <FaHeartbeat />,
    tag: "Wellness",
    color: "card-pink",
  },
  {
    img: "/images/community-intro.jpg",
    title: "Community Chats",
    desc: "Connect with a supportive community that truly understands your journey.",
    icon: <FaUsers />,
    tag: "Community",
    color: "card-violet",
  },
  {
    img: "/images/education-intro.jpg",
    title: "Health Education",
    desc: "Explore a rich library of expert-curated menstrual health resources.",
    icon: <FaBook />,
    tag: "Learn",
    color: "card-rose",
  },
];

const Intro = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="intro-page">
      {/* Ambient background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* ── NAV ───────────────────────────────── */}
      <header>
        <nav className="nav-container">
          <div className="logo-box">
            <img src="/images/syncoracutout.png" alt="Syncora" />
          </div>
          <div className="nav-buttons">
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="register-button">Register</button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ──────────────────────────────── */}
      <main>
        <section className="hero">
          <div className="hero-circle hero-c1" />
          <div className="hero-circle hero-c2" />
          <div className="hero-circle hero-c3" />

          <div className="intro-headings">
            <span className="hero-pill">✨ Your Cycle. Your Power.</span>
            <div>
              <h1>
                Track, Learn,
                <br />
                <span className="hero-gradient-text">Connect</span>
              </h1>
              <h4>— All in one place</h4>
            </div>
            <p>
              Empowering your menstrual health with insights, solutions, and a
              community of support.
            </p>
            <div className="hero-actions">
              <Link to="/readmore">
                <button className="explore-button">
                  Read More <FaArrowRight className="btn-arrow" />
                </button>
              </Link>
              <Link to="/register">
                <button className="cta-secondary">Get Started Free</button>
              </Link>
            </div>
          </div>

          <div className="intro-image">
            <div className="img-glow-wrap">
              <img
                className="girl-image"
                alt="Syncora platform illustration"
                src="/images/introimage.jpeg"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── FEATURES ──────────────────────────── */}
      <section className="page-2">
        <span className="section-label reveal">WHAT WE OFFER</span>
        <h1 className="section-title reveal">
          Features of <span className="gradient-text">Syncora</span>
        </h1>
        <p className="section-subtitle reveal">
          Everything you need for a healthier, more informed cycle journey
        </p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card reveal ${f.color}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="fc-img-wrap">
                <img src={f.img} alt={f.title} />
                <div className="fc-img-overlay" />
                <span className="fc-tag">{f.tag}</span>
              </div>
              <div className="fc-body">
                <div className="fc-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="fc-cta">
                  Explore <FaArrowRight />
                </span>
              </div>
              <div className="fc-shine" />
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────── */}
      <section className="stats-strip reveal">
        <div className="stat-item">
          <span className="stat-num">10K+</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">98%</span>
          <span className="stat-label">Satisfaction Rate</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">50+</span>
          <span className="stat-label">Expert Articles</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">24/7</span>
          <span className="stat-label">Community Support</span>
        </div>
      </section>

      {/* ── WHY SYNCORA ───────────────────────── */}
      <section>
        <div className="page-3">
          <div className="why-syncora reveal">
            <span className="section-label">WHY US</span>
            <h1>
              Why Choose{" "}
              <span className="gradient-text">Syncora?</span>
            </h1>
            <p>
              Syncora isn&apos;t just a platform — it&apos;s a companion for
              your menstrual health journey. Designed with care and backed by
              science, we provide tools like a mood tracker, personalised
              symptom relief, and expert insights to make your cycle management
              seamless. Dive into a supportive community, explore holistic
              remedies, and access a curated library of resources to feel
              empowered every day.
            </p>
            <Link to="/register" className="why-cta">
              Join Syncora <FaArrowRight />
            </Link>
          </div>
          <div className="reveal img-block">
            <img
              className="page-3-img"
              src="/images/whysyncora.jpg"
              alt="Why Syncora"
            />
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ───────────────────────── */}
      <section className="page-4">
        <div className="reveal img-block">
          <img
            className="page-4-img"
            src="/images/mission21_enhanced.jpeg"
            alt="Our Mission"
          />
        </div>
        <div className="why-syncora reveal">
          <span className="section-label">OUR PURPOSE</span>
          <h1>
            Our <span className="gradient-text">Mission</span>
          </h1>
          <p>
            We believe that empowering women with the right tools and insights
            can transform how they manage their health. Syncora is built to
            provide a holistic approach, combining data-driven insights,
            community engagement, and natural remedies for a happier, healthier
            you.
          </p>
          <Link to="/readmore" className="why-cta">
            Learn More <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────── */}
      <footer>
        <div className="footer">
          <div className="footer-brand">
            <img
              src="/images/syncoracutout.png"
              alt="Syncora"
              className="footer-logo"
            />
            <p>Your health companion, always.</p>
          </div>
          <div className="footer-mid">
            <div className="f-social-info">
              <a href="#" aria-label="Facebook">
                <FaFacebookSquare />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagramSquare />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
            <div className="f-tag">
              &copy; {new Date().getFullYear()} Syncora Private Limited
            </div>
          </div>
          <div className="f-info-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Intro;
