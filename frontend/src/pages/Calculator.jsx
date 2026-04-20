import { useState, useCallback, useEffect } from "react";
import "../css/calculator.css";

const tips = [
  { icon: "fa-solid fa-droplet", title: "Stay Hydrated", text: "Drink 8+ glasses of water daily to ease cramps." },
  { icon: "fa-solid fa-moon", title: "Track Sleep", text: "Quality sleep helps regulate your menstrual cycle." },
  { icon: "fa-solid fa-heart-pulse", title: "Stay Active", text: "Light exercise can reduce PMS symptoms significantly." },
];

const Calculator = () => {
  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [bodyTemp, setBodyTemp] = useState("");
  const [weight, setWeight] = useState("");
  const [calendars, setCalendars] = useState([]);
  const [visibleCalendars, setVisibleCalendars] = useState([]);

  const getDatesInMonth = useCallback((date, firstDay, cyclesLen, lastPeriodLen) => {
    let periodDays = [];
    let ovulationDays = [];

    const monthsDifference =
      date.getMonth() - firstDay.getMonth() + 12 * (date.getFullYear() - firstDay.getFullYear());

    const cycleStartDate = new Date(firstDay);
    cycleStartDate.setDate(firstDay.getDate() + monthsDifference * cyclesLen);

    for (let i = 0; i < lastPeriodLen; i++) {
      const periodDate = new Date(cycleStartDate);
      periodDate.setDate(cycleStartDate.getDate() + i);
      if (periodDate.getMonth() === date.getMonth()) {
        periodDays.push(periodDate);
      }
    }

    const ovulationStart = new Date(cycleStartDate);
    ovulationStart.setDate(cycleStartDate.getDate() + (cyclesLen - 16));

    for (let i = 0; i < 5; i++) {
      const ovulationDate = new Date(ovulationStart);
      ovulationDate.setDate(ovulationStart.getDate() + i);
      if (ovulationDate.getMonth() === date.getMonth()) {
        ovulationDays.push(ovulationDate);
      }
    }

    return { periodDays, ovulationDays };
  }, []);

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleCalculate = () => {
    if (!startDate || !bodyTemp || !weight) {
      alert("Please fill in all fields.");
      return;
    }

    const firstDay = new Date(startDate);
    const results = [];

    for (let i = 0; i < 3; i++) {
      const currentMonth = new Date(firstDay);
      currentMonth.setMonth(firstDay.getMonth() + i);

      const { periodDays, ovulationDays } = getDatesInMonth(
        currentMonth, firstDay, cycleLength, periodDuration
      );

      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
      const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

      const weeks = [];
      let dateCounter = 1;
      for (let week = 0; week < 6; week++) {
        const days = [];
        for (let day = 0; day < 7; day++) {
          if ((week === 0 && day < firstDayOfWeek) || dateCounter > daysInMonth) {
            days.push(null);
          } else {
            const currDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dateCounter);
            const isPeriod = periodDays.some((d) => isSameDate(d, currDate));
            const isOvulation = ovulationDays.some((d) => isSameDate(d, currDate));
            const isToday = isSameDate(currDate, new Date());
            days.push({ date: dateCounter, isPeriod, isOvulation, isToday });
            dateCounter++;
          }
        }
        weeks.push(days);
        if (dateCounter > daysInMonth) break;
      }

      results.push({
        title: currentMonth.toLocaleString("default", { month: "long", year: "numeric" }),
        weeks,
      });
    }

    setCalendars(results);
    setVisibleCalendars([]);
  };

  useEffect(() => {
    if (calendars.length === 0) return;
    calendars.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCalendars((prev) => [...prev, i]);
      }, 200 + i * 180);
    });
  }, [calendars]);

  const cycleLengthOptions = Array.from({ length: 23 }, (_, i) => i + 22);
  const periodDurationOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="calc-page">
      {/* Hero Header */}
      <div className="calc-hero">
        <div className="calc-hero-bg" />
        <div className="calc-hero-content">
          <div className="calc-hero-pill">
            <i className="fa-solid fa-calendar-check" />
            &nbsp;Cycle Tracker
          </div>
          <h1 className="calc-hero-title">
            Period <span className="calc-hero-accent">Calculator</span>
          </h1>
          <p className="calc-hero-subtitle">
            Predict your upcoming periods, ovulation windows, and fertile days
            with accuracy. Take control of your cycle.
          </p>
        </div>
        <div className="calc-circle calc-c1" />
        <div className="calc-circle calc-c2" />
        <div className="calc-circle calc-c3" />
      </div>

      {/* Tips Row */}
      <div className="calc-tips">
        {tips.map((tip, i) => (
          <div className="calc-tip-card" key={i} style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
            <div className="calc-tip-icon">
              <i className={tip.icon} />
            </div>
            <div>
              <h4>{tip.title}</h4>
              <p>{tip.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="calc-form-wrapper">
        <div className="calc-form-card">
          <div className="calc-form-header">
            <i className="fa-solid fa-sliders" />
            <h2>Enter Your Details</h2>
          </div>

          <div className="calc-form-grid">
            <div className="calc-field calc-field-full">
              <label htmlFor="start-date">
                <i className="fa-regular fa-calendar" /> Period Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="calc-field">
              <label htmlFor="cycle-length">
                <i className="fa-solid fa-rotate" /> Average Cycle Length
              </label>
              <select
                id="cycle-length"
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
              >
                {cycleLengthOptions.map((d) => (
                  <option key={d} value={d}>{d} days</option>
                ))}
              </select>
            </div>

            <div className="calc-field">
              <label htmlFor="period-duration">
                <i className="fa-solid fa-hourglass-half" /> Last Period Length
              </label>
              <select
                id="period-duration"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(parseInt(e.target.value, 10))}
              >
                {periodDurationOptions.map((d) => (
                  <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                ))}
              </select>
            </div>

            <div className="calc-field">
              <label htmlFor="body-temp">
                <i className="fa-solid fa-temperature-half" /> Body Temperature (°C)
              </label>
              <input
                type="number"
                id="body-temp"
                step="0.1"
                placeholder="e.g. 36.5"
                value={bodyTemp}
                onChange={(e) => setBodyTemp(e.target.value)}
              />
            </div>

            <div className="calc-field">
              <label htmlFor="weight">
                <i className="fa-solid fa-weight-scale" /> Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                step="0.1"
                placeholder="e.g. 58"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <button type="button" className="calc-submit-btn" onClick={handleCalculate}>
            <i className="fa-solid fa-calculator" />
            Calculate My Cycle
          </button>
        </div>
      </div>

      {/* Calendars */}
      {calendars.length > 0 && (
        <div className="calc-results-section">
          <div className="calc-results-heading">
            <h2>Your Cycle Forecast</h2>
            <p>Here&apos;s your predicted period and ovulation schedule for the next 3 months</p>
          </div>

          <div className="calc-calendars">
            {calendars.map((cal, idx) => (
              <div
                key={idx}
                className={`calc-calendar-card ${visibleCalendars.includes(idx) ? "calc-cal-visible" : ""}`}
              >
                <div className="calc-cal-header">
                  <i className="fa-regular fa-calendar-days" />
                  <h3>{cal.title}</h3>
                </div>
                <table className="calc-table">
                  <thead>
                    <tr>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <th key={d}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cal.weeks.map((week, wi) => (
                      <tr key={wi}>
                        {week.map((day, di) => (
                          <td
                            key={di}
                            className={
                              day
                                ? [
                                    day.isPeriod ? "cell-period" : "",
                                    day.isOvulation ? "cell-ovulation" : "",
                                    day.isToday ? "cell-today" : "",
                                  ].filter(Boolean).join(" ")
                                : "cell-empty"
                            }
                          >
                            {day ? <span>{day.date}</span> : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="calc-legend">
            <div className="calc-legend-item">
              <span className="calc-legend-dot legend-period" />
              Period Days
            </div>
            <div className="calc-legend-item">
              <span className="calc-legend-dot legend-ovulation" />
              Ovulation Window
            </div>
            <div className="calc-legend-item">
              <span className="calc-legend-dot legend-today" />
              Today
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
