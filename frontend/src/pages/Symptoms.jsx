import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllSymptoms } from "../services/api";
import "../css/symptom.css";

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const { data } = await getAllSymptoms();
        setSymptoms(data.symptoms);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch symptoms");
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  if (symptoms.length === 0) {
    return <div className="alert alert-info m-3">No symptoms found in the database.</div>;
  }

  return (
    <div className="solution-card-container row row-cols-lg-6 row-cols-md-4 row-cols-sm-2">
      {symptoms.map((symptom) => (
        <Link className="symptom-title-link" to={`/symptoms/${symptom._id}`} key={symptom._id}>
          <div className="card symptom-card">
            <div className="symptom-img-box">
              <img src={symptom.image} className="card-img-top" alt="symptom" />
            </div>
            <div className="card-body">
              <p className="card-text">{symptom.symptom}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Symptoms;
