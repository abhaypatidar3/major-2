import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/api";
import "../css/profile.css";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    city: "",
    lastPeriodStartDate: "",
    avgCycleLength: "",
    periodDuration: "",
    cycleRegularity: "",
    Medical_Conditions: [],
    currentMedications: false,
  });

  const [Medical_ConditionsInput, setMedical_ConditionsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        city: user.city || "",
        lastPeriodStartDate: user.lastPeriodStartDate
          ? user.lastPeriodStartDate.split("T")[0]
          : "",
        avgCycleLength: user.avgCycleLength ?? "",
        periodDuration: user.periodDuration ?? "",
        cycleRegularity: user.cycleRegularity || "",
        Medical_Conditions: user.Medical_Conditions || [],
        currentMedications: user.currentMedications ?? false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addMedical_Conditions = () => {
    const trimmed = Medical_ConditionsInput.trim();
    if (!trimmed) return;
    const exists = form.Medical_Conditions.some(
      (d) => d.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setMedical_ConditionsInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      Medical_Conditions: [...prev.Medical_Conditions, trimmed],
    }));
    setMedical_ConditionsInput("");
  };

  const removeMedical_Conditions = (index) => {
    setForm((prev) => ({
      ...prev,
      Medical_Conditions: prev.Medical_Conditions.filter((_, i) => i !== index),
    }));
  };

  const onMedical_ConditionsKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMedical_Conditions();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload = {
        ...form,
        city: form.city.trim(),
      };

      if (!payload.lastPeriodStartDate) delete payload.lastPeriodStartDate;
      if (payload.avgCycleLength === "") delete payload.avgCycleLength;
      if (payload.periodDuration === "") delete payload.periodDuration;
      if (!payload.cycleRegularity) delete payload.cycleRegularity;

      const { data } = await updateProfile(payload);
      if (data?.user) {
        setUser(data.user);
      }
      setMessage("Profile saved successfully!");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const initials = user
    ? `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="profile-page">
      {/* ── Header banner ── */}
      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h1 className="profile-hero-name">
            {user?.firstname} {user?.lastname}
          </h1>
          <p className="profile-hero-sub">@{user?.username}</p>
          <p className="profile-hero-email">{user?.emailaddress}</p>
        </div>
        <div className="profile-hero-circles">
          <div className="ph-circle ph-c1" />
          <div className="ph-circle ph-c2" />
          <div className="ph-circle ph-c3" />
        </div>
      </div>

      {/* ── Form ── */}
      <form className="profile-form" onSubmit={handleSubmit}>
        {/* ── Personal & Cycle Info ── */}
        <div className="profile-section">
          <div className="profile-section-header">
            <i className="fa-solid fa-user-circle" />
            <h2>Personal &amp; Cycle Info</h2>
          </div>

          <div className="profile-grid">
            {/* City */}
            <div className="pf-field">
              <label htmlFor="city">
                <i className="fa-solid fa-location-dot" /> City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            {/* Age (read-only from registration) */}
            <div className="pf-field">
              <label htmlFor="age">
                <i className="fa-solid fa-cake-candles" /> Age
              </label>
              <input
                id="age"
                type="number"
                value={user?.age ?? ""}
                readOnly
                className="pf-readonly"
                title="Age is set during registration"
              />
            </div>

            {/* Last period start date */}
            <div className="pf-field">
              <label htmlFor="lastPeriodStartDate">
                <i className="fa-solid fa-calendar-day" /> Last Period Start
                Date
              </label>
              <input
                id="lastPeriodStartDate"
                type="date"
                name="lastPeriodStartDate"
                value={form.lastPeriodStartDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Average cycle length */}
            <div className="pf-field">
              <label htmlFor="avgCycleLength">
                <i className="fa-solid fa-rotate" /> Average Cycle Length (days)
              </label>
              <input
                id="avgCycleLength"
                type="number"
                name="avgCycleLength"
                placeholder="e.g. 28"
                min={15}
                max={60}
                value={form.avgCycleLength}
                onChange={handleChange}
              />
            </div>

            {/* Period duration */}
            <div className="pf-field">
              <label htmlFor="periodDuration">
                <i className="fa-solid fa-hourglass-half" /> Period Duration
                (days)
              </label>
              <input
                id="periodDuration"
                type="number"
                name="periodDuration"
                placeholder="e.g. 5"
                min={1}
                max={15}
                value={form.periodDuration}
                onChange={handleChange}
              />
            </div>

            {/* Cycle regularity */}
            <div className="pf-field">
              <label htmlFor="cycleRegularity">
                <i className="fa-solid fa-wave-square" /> Cycle Regularity
              </label>
              <select
                id="cycleRegularity"
                name="cycleRegularity"
                value={form.cycleRegularity}
                onChange={handleChange}
              >
                <option value="">Select regularity</option>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Medical Info ── */}
        <div className="profile-section">
          <div className="profile-section-header">
            <i className="fa-solid fa-dna" />
            <h2>Key Medical Info</h2>
          </div>

          <div className="pf-medical">
            {/* Diagnosis — free text + add */}
            <div className="pf-field pf-field-full">
              <p className="pf-group-title">
                <i className="fa-solid fa-stethoscope" /> Medical Conditions
              </p>
              <p className="pf-hint">
                Type a condition and click Add (or press Enter). You can add
                multiple.
              </p>
              <div className="pf-diagnosis-row">
                <input
                  type="text"
                  className="pf-diagnosis-input"
                  placeholder="e.g. PCOS, anemia, hypothyroidism..."
                  value={Medical_ConditionsInput}
                  onChange={(e) => setMedical_ConditionsInput(e.target.value)}
                  onKeyDown={onMedical_ConditionsKeyDown}
                  maxLength={200}
                  aria-label="Diagnosis name"
                />
                <button
                  type="button"
                  className="pf-add-btn"
                  onClick={addMedical_Conditions}
                >
                  Add
                </button>
              </div>
              {form.Medical_Conditions.length > 0 && (
                <ul className="pf-diagnosis-tags" aria-label="Added diagnoses">
                  {form.Medical_Conditions.map((d, i) => (
                    <li key={`${d}-${i}`} className="pf-tag">
                      <span>{d}</span>
                      <button
                        type="button"
                        className="pf-tag-remove"
                        onClick={() => removeMedical_Conditions(i)}
                        aria-label={`Remove ${d}`}
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Current medications */}
            <div className="pf-field pf-field-full">
              <p className="pf-group-title">
                <i className="fa-solid fa-pills" /> Currently on Medications?
              </p>
              <div className="pf-toggle-group">
                <label
                  className={`pf-toggle-btn ${form.currentMedications ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="currentMedications"
                    value="true"
                    checked={form.currentMedications === true}
                    onChange={() =>
                      setForm((p) => ({ ...p, currentMedications: true }))
                    }
                  />{" "}
                  Yes
                </label>
                <label
                  className={`pf-toggle-btn ${form.currentMedications === false ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="currentMedications"
                    value="false"
                    checked={form.currentMedications === false}
                    onChange={() =>
                      setForm((p) => ({ ...p, currentMedications: false }))
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feedback ── */}
        {message && (
          <div className="pf-alert pf-alert-success">
            <i className="fa-solid fa-circle-check" /> {message}
          </div>
        )}
        {error && (
          <div className="pf-alert pf-alert-error">
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </div>
        )}

        {/* ── Submit ── */}
        <button type="submit" className="pf-save-btn" disabled={saving}>
          {saving ? (
            <>
              <span className="pf-spinner" /> Saving...
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk" /> Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
