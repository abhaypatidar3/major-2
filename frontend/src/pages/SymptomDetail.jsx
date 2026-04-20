import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSymptomById } from "../services/api";
import "../css/symptom.css";

const SymptomDetail = () => {
  const { id } = useParams();
  const [symptom, setSymptom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSymptom = async () => {
      try {
        const { data } = await getSymptomById(id);
        setSymptom(data.symptom);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch symptom details");
      } finally {
        setLoading(false);
      }
    };
    fetchSymptom();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!symptom) return <div className="alert alert-info m-3">Symptom not found.</div>;

  return (
    <div className="main-container">
      <div className="aside">
        <div className="solutions"><b>Solutions</b></div>
        <ul className="nav">
          <li><a href="#yoga"><i className="fa fa-solid fa-person-walking"></i>Yoga &amp; Exercises</a></li>
          <li><a href="#diet"><i className="fa fa-solid fa-utensils"></i>Diet Recommendations</a></li>
          <li><a href="#remedies"><i className="fa fa-solid fa-house"></i>Home Remedies</a></li>
          <li><a href="#medicine"><i className="fa fa-solid fa-capsules"></i>Medications</a></li>
          <li><a href="#herbal"><i className="fa fa-solid fa-leaf"></i>Herbal Treatments</a></li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="sol-heading">{symptom.symptom}</h2>

        {/* Yoga Section */}
        <div id="yoga">
          <section className="yoga section">
            <h3 className="padd-15">Yoga Exercises</h3>
            <ul className="ul-box">
              {symptom.solutions.yoga.map((exercise, i) => (
                <li className="li-box" key={i}>
                  <div className="content-box">
                    <h4>{exercise.name}</h4>
                    <p><strong>Benefits:</strong> {exercise.benefits.join(", ")}</p>
                    <p><strong>How to Do:</strong> {exercise.howToDo}</p>
                    <p><strong>When to Do:</strong> {exercise.whenToDo || "Anytime"}</p>
                  </div>
                  <div className="img-box">
                    <img src={exercise.image} alt={exercise.name} width="200" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Diet Section */}
        <div id="diet">
          <section className="diet section">
            <h3 className="padd-15">Diet Suggestions</h3>
            <h4 className="padd-15">Foods to Eat:</h4>
            <ul className="ul-box">
              {symptom.solutions.diet.eat.map((item, i) => (
                <li className="li-box" key={i}>
                  <div className="content-box">
                    <p><strong>Food:</strong> {item.item}</p>
                    <p><strong>Benefits:</strong> {item.benefits.join(", ")}</p>
                    <p><strong>Recommended Quantity:</strong> {item.quantity || "As per need"}</p>
                  </div>
                  <div className="img-box">
                    <img src={item.image} alt={item.item} width="200" />
                  </div>
                </li>
              ))}
            </ul>
            <h4 className="padd-15">Foods to Avoid:</h4>
            <ul className="ul-box">
              {symptom.solutions.diet.avoid.map((item, i) => (
                <li className="li-box" key={i}>
                  <div className="content-box">
                    <p><strong>Food:</strong> {item.item}</p>
                    <p><strong>Reasons to Avoid:</strong> {item.reasons.join(", ")}</p>
                  </div>
                  <div className="img-box">
                    <img src={item.image} alt={item.item} width="200" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Home Remedies Section */}
        <div id="remedies">
          <section className="remedies section">
            <h3 className="padd-15">Home Remedies</h3>
            <ul className="ul-box">
              {symptom.solutions.homeRemedies.map((remedy, i) => (
                <li className="li-box" key={i}>
                  <div className="content-box">
                    <p><strong>Remedy:</strong> {remedy.remedy}</p>
                    <p><strong>Ingredients:</strong> {remedy.ingredients.join(", ")}</p>
                    <p><strong>Preparation:</strong> {remedy.preparation}</p>
                    <p><strong>Benefits:</strong> {remedy.benefits.join(", ")}</p>
                  </div>
                  <div className="img-box">
                    <img src={remedy.image} alt={remedy.remedy} width="200" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* OTC Medications Section */}
        <div id="medicine">
          <section className="medicine section">
            <h3 className="padd-15">OTC Medications</h3>
            <ul className="ul-box">
              {symptom.solutions.otcMedications.map((med, i) => (
                <li className="li-box" key={i}>
                  <div className="content-box">
                    <p><strong>Medication:</strong> {med.name}</p>
                    <p><strong>Usage:</strong> {med.usage}</p>
                    <p><strong>Side Effects:</strong> {med.sideEffects.join(", ")}</p>
                  </div>
                  <div className="img-box">
                    <img src={med.image} alt={med.name} width="200" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Herbal Treatments Section */}
        <div id="herbal">
          <section className="herbal section">
            <h3 className="padd-15">Herbal Treatments</h3>
            <ul className="ul-box">
              {symptom.solutions.herbalTreatments.map((herb, i) => (
                <li className="li-box" key={i}>
                  <div className="content-box">
                    <p><strong>Herb:</strong> {herb.herb}</p>
                    <p><strong>Benefits:</strong> {herb.benefits.join(", ")}</p>
                    <p><strong>Preparation:</strong> {herb.preparation || "Use as instructed"}</p>
                    <p><strong>Precautions:</strong> {herb.precautions.join(", ")}</p>
                  </div>
                  <div className="img-box">
                    <img src={herb.image} alt={herb.herb} width="200" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SymptomDetail;
