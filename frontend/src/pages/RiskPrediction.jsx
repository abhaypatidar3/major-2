import { useState } from "react";
import { getRiskPrediction } from "../services/api";
import { Link } from "react-router-dom";
import "../css/riskprediction.css";

const LIKELIHOOD_CONFIG = {
  low: { label: "Low", color: "#388e3c", bg: "#e8f5e9" },
  moderate: { label: "Moderate", color: "#f57c00", bg: "#fff3e0" },
  high: { label: "High", color: "#c62828", bg: "#ffebee" },
};

const RiskPrediction = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await getRiskPrediction();
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

  return (
    <div className="rp-page">
      <div className="rp-hero">
        <h1>Health Risk Prediction</h1>
        <p>
          AI analyzes your cycle logs and profile to flag potential health
          patterns
        </p>
      </div>

      <div className="rp-container">
        {/* ── INTRO CARD ── */}
        {!result && !loading && (
          <div className="rp-intro-card">
            <div className="rp-intro-icon">🔬</div>
            <h2>How it works</h2>
            <ul className="rp-how-list">
              <li>We analyze your last 3 months of cycle logs</li>
              <li>
                Combined with your profile (age, cycle regularity, conditions)
              </li>
              <li>
                AI identifies patterns linked to PCOS, endometriosis, PMDD and
                more
              </li>
              <li>You get a gentle, actionable report — not a diagnosis</li>
            </ul>
            <p className="rp-tip">
              💡 The more days you've logged in{" "}
              <Link to="/cycle-tracker">Cycle Tracker</Link>, the more accurate
              this will be.
            </p>
            {error && <div className="rp-error">{error}</div>}
            <button className="rp-analyze-btn" onClick={handleAnalyze}>
              Analyze My Cycle Health
            </button>
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="rp-loading">
            <div className="spinner-border" role="status" />
            <p>Analyzing your cycle data...</p>
            <span>This may take a few seconds</span>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && !loading && (
          <div className="rp-results">
            {/* Data quality banner */}
            <div
              className={`rp-data-quality rp-data-quality--${result.data_quality}`}
            >
              <span className="rp-dq-icon">
                {result.data_quality === "good"
                  ? "✅"
                  : result.data_quality === "limited"
                    ? "⚠️"
                    : "❌"}
              </span>
              <span>{result.data_quality_message}</span>
            </div>

            {/* Overall summary */}
            <div className="rp-summary-card">
              <h2>Overall Summary</h2>
              <p>{result.overall_summary}</p>
            </div>

            {/* Positive signs */}
            {result.positive_signs?.length > 0 && (
              <div className="rp-positives">
                <h2>Positive Signs 💚</h2>
                <ul>
                  {result.positive_signs.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk cards */}
            {result.risks?.length > 0 && (
              <>
                <h2 className="rp-risks-title">Patterns to Watch</h2>
                <div className="rp-risks-grid">
                  {result.risks.map((risk, i) => {
                    const config =
                      LIKELIHOOD_CONFIG[risk.likelihood] ||
                      LIKELIHOOD_CONFIG.low;
                    return (
                      <div
                        className="rp-risk-card"
                        key={i}
                        style={{ borderTopColor: config.color }}
                      >
                        <div className="rp-risk-header">
                          <h3 className="rp-risk-condition">
                            {risk.condition}
                          </h3>
                          <span
                            className="rp-risk-badge"
                            style={{
                              background: config.bg,
                              color: config.color,
                            }}
                          >
                            {config.label} attention
                          </span>
                        </div>
                        <p className="rp-risk-reason">{risk.reason}</p>

                        <div className="rp-risk-detail">
                          <span className="rp-detail-label">What to watch</span>
                          <p>{risk.what_to_watch}</p>
                        </div>
                        <div className="rp-risk-detail">
                          <span className="rp-detail-label">What to do</span>
                          <p>{risk.action}</p>
                        </div>
                        <div className="rp-risk-detail rp-risk-learn">
                          <span className="rp-detail-label">
                            About this condition
                          </span>
                          <p>{risk.learn_more}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {result.risks?.length === 0 && (
              <div className="rp-no-risks">
                <span>🌸</span>
                <p>
                  No significant risk patterns detected in your current data.
                  Keep logging!
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rp-disclaimer">{result.disclaimer}</div>

            {/* Find gynaecologist CTA */}
            {result.risks?.some(
              (r) => r.likelihood === "moderate" || r.likelihood === "high",
            ) && (
              <div className="rp-cta">
                <p>
                  Some patterns were flagged. Consider speaking to a specialist.
                </p>
                <Link to="/find-gynaecologists" className="rp-cta-btn">
                  Find a Gynaecologist →
                </Link>
              </div>
            )}

            <button
              className="rp-reanalyze-btn"
              onClick={() => {
                setResult(null);
                setError(null);
              }}
            >
              ← Run Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskPrediction;
