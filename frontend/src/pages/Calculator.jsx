import { useState, useCallback } from "react";
import "../css/calculator.css";

const Calculator = () => {
  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [bodyTemp, setBodyTemp] = useState("");
  const [weight, setWeight] = useState("");
  const [calendars, setCalendars] = useState([]);

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
  };

  const cycleLengthOptions = Array.from({ length: 23 }, (_, i) => i + 22);
  const periodDurationOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-6 offset-md-3 form">
          <h1 className="col-8 offset-3">Period Calculator</h1>

          <div className="mb-5">
            <label className="form-label" htmlFor="start-date">Period Start Date:</label>
            <input className="form-control" type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>

          <div className="row">
            <div className="mb-5 col-6">
              <label htmlFor="cycle-length" className="form-label">
                <p className="input__title">Average Cycle Length</p>
              </label>
              <select id="cycle-length" className="form-control" value={cycleLength} onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}>
                {cycleLengthOptions.map((d) => (
                  <option key={d} value={d}>{d} days</option>
                ))}
              </select>
            </div>

            <div className="mb-5 col-6">
              <label htmlFor="period-duration" className="form-label">
                <p className="input__title">Last Period Length</p>
              </label>
              <select id="period-duration" className="form-control" value={periodDuration} onChange={(e) => setPeriodDuration(parseInt(e.target.value, 10))}>
                {periodDurationOptions.map((d) => (
                  <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="body-temp" className="form-label">Body Temperature (°C):</label>
            <input className="form-control" type="number" id="body-temp" step="0.1" value={bodyTemp} onChange={(e) => setBodyTemp(e.target.value)} />
          </div>

          <div>
            <label htmlFor="weight" className="form-label">Weight (kg):</label>
            <input className="form-control" type="number" id="weight" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          <button type="button" className="btn btn-dark mb-3 mt-3" onClick={handleCalculate}>Calculate</button>
        </div>
      </div>

      <div id="calendars">
        {calendars.map((cal, idx) => (
          <div key={idx} className="calendar">
            <h3>{cal.title}</h3>
            <table>
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
                            ? `${day.isPeriod ? "pink-cell" : ""} ${day.isOvulation ? "green-cell" : ""} ${day.isToday ? "today" : ""}`
                            : ""
                        }
                      >
                        {day ? day.date : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {calendars.length > 0 && (
        <div className="offset-3 sign-box">
          <div>
            <div className="guide pink-cell"></div>
            <p>Period days</p>
          </div>
          <div>
            <div className="guide green-cell"></div>
            <p>Ovulation days</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Calculator;
