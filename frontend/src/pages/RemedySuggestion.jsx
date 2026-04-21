import { useState } from "react";
import { getRemedySuggestions } from "../services/api";
import "../css/remedy.css";

// ── data for chips ──────────────────────────────────────────
const PHASES = [
  { value: "menstrual", label: "Menstrual", sub: "Day 1–5" },
  { value: "follicular", label: "Follicular", sub: "Day 6–13" },
  { value: "ovulatory", label: "Ovulatory", sub: "Day 14–16" },
  { value: "luteal", label: "Luteal / PMS", sub: "Day 17–28" },
];

const MOODS = [
  "Irritable",
  "Anxious",
  "Sad / Low",
  "Fatigued",
  "Brain Fog",
  "Emotional",
  "Happy",
];

const CRAVINGS = [
  "Chocolate",
  "Salty Snacks",
  "Sweets",
  "Carbs",
  "Spicy Food",
  "Nothing Specific",
];

const SYMPTOMS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Back Pain",
  "Breast Tenderness",
  "Acne",
  "Nausea",
  "Insomnia",
  "Heavy Flow",
  "Low Energy",
];

// ── card config ─────────────────────────────────────────────
const CARDS = [
  { key: "recipe", icon: "🍲", label: "Recipe" },
  { key: "ayurvedic", icon: "🌿", label: "Ayurvedic Remedy" },
  { key: "dietary", icon: "🥗", label: "Dietary Tip" },
  { key: "yoga", icon: "🧘", label: "Yoga / Exercise" },
  { key: "home_remedy", icon: "🏠", label: "Home Remedy" },
  { key: "medication", icon: "💊", label: "Medication Note" },
];

// ── component ────────────────────────────────────────────────
const RemedySuggestion = () => {
  const [phase, setPhase] = useState("");
  const [mood, setMood] = useState([]);
  const [cravings, setCravings] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // toggle helper — works for any multi-select group
  const toggle = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = async () => {
    if (!phase && !symptoms.length && !mood.length) {
      setError(
        "Please select your cycle phase or at least one mood / symptom.",
      );
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const { data } = await getRemedySuggestions({
        phase,
        mood,
        cravings,
        symptoms,
      });
      setResult(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhase("");
    setMood([]);
    setCravings([]);
    setSymptoms([]);
    setResult(null);
    setError(null);
  };

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="remedy-page">
      <div className="remedy-hero">
        <h1>Remedy Suggestions</h1>
        <p>Tell us how you're feeling and get personalised recommendations</p>
      </div>

      <div className="remedy-container">
        {/* ── FORM ── */}
        {!result && (
          <div className="remedy-form">
            {/* Cycle Phase */}
            <div className="remedy-section">
              <h2 className="remedy-section-title">Your cycle phase</h2>
              <div className="phase-grid">
                {PHASES.map((p) => (
                  <button
                    key={p.value}
                    className={`phase-btn ${phase === p.value ? "active" : ""}`}
                    onClick={() => setPhase(p.value)}
                  >
                    <span className="phase-label">{p.label}</span>
                    <span className="phase-sub">{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="remedy-section">
              <h2 className="remedy-section-title">How are you feeling?</h2>
              <div className="chip-group">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    className={`chip ${mood.includes(m) ? "active" : ""}`}
                    onClick={() => toggle(setMood, m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Cravings */}
            <div className="remedy-section">
              <h2 className="remedy-section-title">Any cravings?</h2>
              <div className="chip-group">
                {CRAVINGS.map((c) => (
                  <button
                    key={c}
                    className={`chip ${cravings.includes(c) ? "active" : ""}`}
                    onClick={() => toggle(setCravings, c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="remedy-section">
              <h2 className="remedy-section-title">
                Symptoms you're experiencing
              </h2>
              <div className="chip-group">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s}
                    className={`chip ${symptoms.includes(s) ? "active" : ""}`}
                    onClick={() => toggle(setSymptoms, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="remedy-error">{error}</div>}

            <button
              className="remedy-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Getting your recommendations..."
                : "Get My Recommendations"}
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="remedy-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Preparing your personalised plan...</p>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && !loading && (
          <div className="remedy-results">
            <div className="remedy-results-header">
              <h2>Your Personalised Plan</h2>
              <button className="remedy-reset-btn" onClick={handleReset}>
                ← Start Over
              </button>
            </div>

            <div className="remedy-cards-grid">
              {CARDS.map(({ key, icon, label }) => {
                const rec = result[key];
                if (!rec) return null;
                return (
                  <div className={`remedy-card remedy-card--${key}`} key={key}>
                    <div className="remedy-card-header">
                      <span className="remedy-card-icon">{icon}</span>
                      <span className="remedy-card-label">{label}</span>
                    </div>
                    <h3 className="remedy-card-title">{rec.title}</h3>
                    <p className="remedy-card-desc">{rec.description}</p>
                    {rec.disclaimer && (
                      <div className="remedy-disclaimer">
                        ⚠️ {rec.disclaimer}
                      </div>
                    )}
                    <div className="remedy-card-reason">
                      <span className="reason-label">Why this helps: </span>
                      {rec.reason}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemedySuggestion;
