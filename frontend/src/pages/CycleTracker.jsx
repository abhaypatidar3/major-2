import { useState, useEffect } from "react";
import { saveCycleLog, getCycleLogs, deleteCycleLog } from "../services/api";
import "../css/cycletracker.css";

const SYMPTOMS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Back Pain",
  "Nausea",
  "Fatigue",
  "Acne",
  "Breast Tenderness",
  "Insomnia",
  "Low Energy",
];

const MOODS = [
  "Happy",
  "Irritable",
  "Anxious",
  "Sad",
  "Emotional",
  "Brain Fog",
  "Calm",
  "Fatigued",
];

const FLOW_OPTIONS = [
  { value: "none", label: "None", color: "#eee" },
  { value: "light", label: "Light", color: "#f8bbd0" },
  { value: "medium", label: "Medium", color: "#e91e8c" },
  { value: "heavy", label: "Heavy", color: "#880e4f" },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const toDateKey = (date) => date.toISOString().split("T")[0];

// Returns true if the given dateKey string (YYYY-MM-DD) is after today
const isFutureDate = (dateKey) => {
  const d = new Date(dateKey + "T00:00:00");
  return d > today;
};

const CycleTracker = () => {
  const [logs, setLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [form, setForm] = useState({
    flow: "none",
    symptoms: [],
    mood: [],
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(null);

  // fetch logs on mount — pre-populates calendar from DB on every login
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await getCycleLogs();
        // Backend returns { success, logs }
        const map = {};
        data.logs.forEach((l) => {
          map[toDateKey(new Date(l.date))] = l;
        });
        setLogs(map);
      } catch {
        showFlash("Failed to load logs.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // when selected date changes, load existing log into form (or reset)
  useEffect(() => {
    const existing = logs[selectedDate];
    if (existing) {
      setForm({
        flow: existing.flow || "none",
        symptoms: existing.symptoms || [],
        mood: existing.mood || [],
        notes: existing.notes || "",
      });
    } else {
      setForm({ flow: "none", symptoms: [], mood: [], notes: "" });
    }
  }, [selectedDate, logs]);

  const showFlash = (msg, type = "success") => {
    setFlash({ msg, type });
    setTimeout(() => setFlash(null), 3000);
  };

  const toggle = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await saveCycleLog({ date: selectedDate, ...form });
      // Backend returns { success, log }
      setLogs((prev) => ({ ...prev, [selectedDate]: data.log }));
      showFlash("Log saved!");
    } catch {
      showFlash("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const existing = logs[selectedDate];
    if (!existing) return;
    try {
      await deleteCycleLog(existing._id);
      setLogs((prev) => {
        const updated = { ...prev };
        delete updated[selectedDate];
        return updated;
      });
      showFlash("Log deleted.");
    } catch {
      showFlash("Failed to delete.", "error");
    }
  };

  // ── Calendar helpers ───────────────────────────────────────
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    // empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="ct-cell ct-cell--empty" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const log = logs[dateKey];
      const isSelected = selectedDate === dateKey;
      const isToday = dateKey === toDateKey(today);
      const isFuture = isFutureDate(dateKey);
      const flow = log?.flow || "none";

      cells.push(
        <div
          key={dateKey}
          className={[
            "ct-cell",
            isSelected ? "ct-cell--selected" : "",
            isToday ? "ct-cell--today" : "",
            isFuture ? "ct-cell--future" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          // Disable click for future dates
          onClick={() => !isFuture && setSelectedDate(dateKey)}
          title={isFuture ? "Future dates cannot be logged" : undefined}
        >
          <span className="ct-day-num">{d}</span>
          {flow !== "none" && !isFuture && (
            <span
              className="ct-flow-dot"
              style={{
                background: FLOW_OPTIONS.find((f) => f.value === flow)?.color,
              }}
            />
          )}
          {log?.symptoms?.length > 0 && !isFuture && (
            <span className="ct-has-symptoms" />
          )}
        </div>,
      );
    }
    return cells;
  };

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Prevent navigating to future months beyond the current month
  const isCurrentMonth =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  if (loading) {
    return (
      <div className="ct-loading">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading your cycle data...</p>
      </div>
    );
  }

  return (
    <div className="ct-page">
      <div className="ct-hero">
        <h1>Cycle Tracker</h1>
        <p>Log your flow, symptoms and mood daily</p>
      </div>

      {flash && (
        <div className={`ct-flash ct-flash--${flash.type}`}>{flash.msg}</div>
      )}

      <div className="ct-layout">
        {/* ── CALENDAR ── */}
        <div className="ct-calendar-card">
          <div className="ct-calendar-nav">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              ‹
            </button>
            <span>{monthName}</span>
            {/* Disable the › button when already on the current month */}
            <button
              onClick={() => {
                if (!isCurrentMonth) {
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1,
                    ),
                  );
                }
              }}
              disabled={isCurrentMonth}
              style={isCurrentMonth ? { opacity: 0.3, cursor: "not-allowed" } : {}}
            >
              ›
            </button>
          </div>
          <div className="ct-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="ct-weekday">
                {d}
              </div>
            ))}
          </div>
          <div className="ct-grid">{renderCalendar()}</div>
          <div className="ct-legend">
            {FLOW_OPTIONS.filter((f) => f.value !== "none").map((f) => (
              <span key={f.value} className="ct-legend-item">
                <span
                  className="ct-legend-dot"
                  style={{ background: f.color }}
                />
                {f.label}
              </span>
            ))}
            <span className="ct-legend-item">
              <span
                className="ct-legend-dot"
                style={{ background: "#7c3aed" }}
              />
              Symptoms
            </span>
          </div>
        </div>

        {/* ── LOG FORM ── */}
        <div className="ct-form-card">
          <h2 className="ct-form-date">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>

          {/* Flow */}
          <p className="ct-form-label">Flow</p>
          <div className="ct-flow-group">
            {FLOW_OPTIONS.map((f) => (
              <button
                key={f.value}
                className={`ct-flow-btn ${form.flow === f.value ? "active" : ""}`}
                style={
                  form.flow === f.value
                    ? {
                        background: f.color,
                        borderColor: f.color,
                        color: f.value === "none" ? "#555" : "#fff",
                      }
                    : {}
                }
                onClick={() => setForm((prev) => ({ ...prev, flow: f.value }))}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Symptoms */}
          <p className="ct-form-label">Symptoms</p>
          <div className="ct-chip-group">
            {SYMPTOMS.map((s) => (
              <button
                key={s}
                className={`ct-chip ${form.symptoms.includes(s) ? "active" : ""}`}
                onClick={() => toggle("symptoms", s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Mood */}
          <p className="ct-form-label">Mood</p>
          <div className="ct-chip-group">
            {MOODS.map((m) => (
              <button
                key={m}
                className={`ct-chip ct-chip--mood ${form.mood.includes(m) ? "active" : ""}`}
                onClick={() => toggle("mood", m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Notes */}
          <p className="ct-form-label">Notes (optional)</p>
          <textarea
            className="ct-notes"
            rows={3}
            placeholder="Any other observations..."
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />

          <div className="ct-form-actions">
            <button
              className="ct-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : logs[selectedDate]
                  ? "Update Log"
                  : "Save Log"}
            </button>
            {logs[selectedDate] && (
              <button className="ct-delete-btn" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;