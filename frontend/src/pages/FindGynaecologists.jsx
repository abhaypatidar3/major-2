import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDoctorsByCity } from "../services/api";
import "../css/findGynaecologists.css";

const normalizeCity = (value) => value.trim().toLowerCase();
const SUPPORTED_CITY_HINTS = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Pune",
  "Hyderabad",
];

const GYNAE_INCLUDE_KEYWORDS = [
  "gyna",
  "gyne",
  "obstetric",
  "fertility",
  "ivf",
  "maternity",
  "pregnan",
  "women clinic",
  "women hospital",
  "lady doctor",
];

const IRRELEVANT_KEYWORDS = [
  "institute",
  "academy",
  "college",
  "coaching",
  "tuition",
  "tutorial",
  "training",
  "education",
  "school",
  "classes",
  "career",
  "computer",
  "english",
  "spoken",
];

const isRelevantGynaeDoctor = (doctor) => {
  const haystack =
    `${doctor?.name || ""} ${doctor?.hospital || ""} ${doctor?.specialization || ""}`.toLowerCase();
  const hasInclude = GYNAE_INCLUDE_KEYWORDS.some((keyword) =>
    haystack.includes(keyword),
  );
  const hasExclude = IRRELEVANT_KEYWORDS.some((keyword) =>
    haystack.includes(keyword),
  );
  return hasInclude && !hasExclude;
};

const FindGynaecologists = () => {
  const { user } = useAuth();
  const profileCity = user?.city?.trim() || "";
  const [selectedCity, setSelectedCity] = useState(profileCity || "");
  const [cityLabel, setCityLabel] = useState(profileCity || "");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shouldShowSelector = !profileCity;

  const canSearch = useMemo(
    () => normalizeCity(selectedCity).length > 0,
    [selectedCity],
  );

  const fetchDoctors = async (city) => {
    const cleanCity = city.trim();
    if (!cleanCity) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await getDoctorsByCity(cleanCity, {
        limit: 5,
      });
      const safeDoctors = (data?.doctors || [])
        .filter(isRelevantGynaeDoctor)
        .slice(0, 5);
      setDoctors(safeDoctors);
      setCityLabel(data?.city || cleanCity);
    } catch (err) {
      setDoctors([]);
      setCityLabel(cleanCity);
      setError(
        err?.response?.data?.message ||
          "Unable to fetch doctors right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileCity) {
      fetchDoctors(profileCity);
    }
  }, [profileCity]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (!canSearch) return;
    fetchDoctors(selectedCity);
  };

  return (
    <div className="gyn-page">
      <section className="gyn-hero">
        <div className="gyn-hero-bg" />
        <div className="gyn-hero-content">
          <p className="gyn-hero-kicker">Find Nearby Care</p>
          <h1>
            Top Gynaecologists in <span>{cityLabel || "Your City"}</span>
          </h1>
          <p>
            Quick access to reputed specialists so you can get timely support
            for menstrual health and gynecological care.
          </p>
        </div>
        <div className="gyn-hero-circles">
          <span />
          <span />
          <span />
        </div>
      </section>

      {shouldShowSelector && (
        <section className="gyn-city-selector">
          <form className="gyn-search-form" onSubmit={onSubmitSearch}>
            <label htmlFor="city-select">Select your city</label>
            <div className="gyn-search-row">
              <input
                id="city-select"
                type="text"
                list="supported-cities"
                placeholder="Type city name"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
              <button type="submit" disabled={!canSearch || loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            <datalist id="supported-cities">
              {SUPPORTED_CITY_HINTS.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </form>
        </section>
      )}

      {error && (
        <div className="gyn-error">
          <strong>Could not load results:</strong> {error}
        </div>
      )}

      <section className="gyn-card-grid">
        {loading && (
          <div className="gyn-empty">Fetching doctors near you...</div>
        )}
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <article className="gyn-card" key={doctor.name}>
              <div className="gyn-card-top">
                <h3>{doctor.name}</h3>
                <span className="gyn-rating">
                  {doctor.rating ? `${doctor.rating} star` : "No rating"}
                </span>
              </div>
              <p className="gyn-hospital">{doctor.hospital}</p>
              <ul>
                <li>
                  <strong>Experience:</strong> {doctor.experience}
                </li>
                <li>
                  <strong>Area:</strong> {doctor.area}
                </li>
                <li>
                  <strong>Specialization:</strong> {doctor.specialization}
                </li>
                <li>
                  <strong>Contact:</strong> {doctor.contact}
                </li>
              </ul>
            </article>
          ))
        ) : (
          <div className="gyn-empty">
            <h3>No doctors found for this city yet</h3>
            <p>
              Try searching a nearby city like {SUPPORTED_CITY_HINTS.join(", ")}
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FindGynaecologists;
