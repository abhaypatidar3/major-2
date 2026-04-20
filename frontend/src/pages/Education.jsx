import { useState } from "react";
import "../css/calculator.css";

const faqData = [
  {
    q: "What is a normal menstrual cycle?",
    a: "The menstrual cycle typically lasts between 21 to 35 days, with bleeding lasting 2 to 7 days. Regularity, flow intensity, and symptoms can vary among individuals. It's important to track your cycle to identify any unusual changes.",
  },
  {
    q: "What causes irregular periods?",
    a: "Irregular periods can result from hormonal imbalances, stress, significant weight changes, excessive exercise, or underlying conditions like PCOS (Polycystic Ovary Syndrome). Consult a healthcare professional if irregularities persist.",
  },
  {
    q: "How can I relieve menstrual cramps?",
    a: "Menstrual cramps can be eased with heat therapy (using a heating pad), over-the-counter pain relievers, hydration, light exercise, or relaxation techniques like yoga. Severe cramps may require medical evaluation.",
  },
  {
    q: "What foods should I eat or avoid during my period?",
    a: "Foods rich in iron (like spinach and lentils), magnesium (like nuts and seeds), and omega-3 fatty acids can help reduce symptoms. Avoid caffeine, salty foods, and processed snacks, as they can worsen bloating and discomfort.",
  },
  {
    q: "What are the signs of a serious menstrual problem?",
    a: "Signs include periods lasting longer than 7 days, extremely heavy bleeding (changing pads or tampons every 1-2 hours), severe pain unresponsive to medication, or skipped periods for more than 3 months (if not due to pregnancy). These symptoms warrant a doctor's attention.",
  },
];

const factsMyths = [
  {
    fact: "Menstrual cramps can be managed with over-the-counter pain relievers and heat therapy.",
    myth: "Menstrual cramps are only caused by stress and anxiety.",
  },
  {
    fact: "Periods generally last between 2 to 7 days.",
    myth: "It's normal for periods to last more than 10 days.",
  },
  {
    fact: "Tracking your menstrual cycle can help you understand your health better.",
    myth: "Tracking your menstrual cycle is unnecessary and doesn't offer any health benefits.",
  },
];

const articles = [
  {
    title: "Demystify Period Cravings",
    desc: "Understand why your body craves specific foods during periods and discover healthy ways to satisfy them",
    link: "https://www.helpingwomenperiod.org/category/blog/",
  },
  {
    title: "Understanding Menstrual Health",
    desc: "Learn about the different phases of the menstrual cycle and how to track your period.",
    link: "https://helloclue.com/articles/about-clue/scientific-research-at-clue",
  },
  {
    title: "Types of Blood",
    desc: "The types of blood during periods can vary in color and consistency, ranging from bright red to brownish.",
    link: "https://www.medicalnewstoday.com/articles/324848",
  },
  {
    title: "Menstrual Health Basics for Teens",
    desc: "This article covers period myths, common concerns, and practical period tips for teenagers.",
    link: "https://youngwomenshealth.org/menstrual-period-all-guides/",
  },
  {
    title: "PCOS and PCOD",
    desc: "Conditions where hormonal imbalances can affect menstrual cycles, leading to irregular periods and ovarian cysts.",
    link: "https://www.manipalhospitals.com/varthurroad/blog/know-all-about-polycystic-ovarian-disease/",
  },
  {
    title: "Hygiene Tips",
    desc: "Maintain good hygiene by washing regularly, using clean products, and wearing breathable clothing.",
    link: "https://www.cdc.gov/hygiene/about/menstrual-hygiene.html",
  },
];

const videos = [
  {
    title: "Menstrual Health of India",
    src: "https://www.youtube.com/embed/ToLIii2wC4I?si=j-0ZFlYFYaV_fVrs",
  },
  {
    title: "10 Yoga Poses to cure periods",
    src: "https://www.youtube.com/embed/3YzSpRncW4s?si=MQLhx36ueMmYHe0A",
  },
  {
    title: "16 Best Hygiene Tips that you should know",
    src: "https://www.youtube.com/embed/6xUqcCbfjeY?si=ufz-0v_UGTjV5REg",
  },
  {
    title: "Health and Diet for PCOS",
    src: "https://www.youtube.com/embed/M1Ed9i3jkHo?si=e6XqGms7uEpMY9kA",
  },
  {
    title: "Your Menstrual Cycles Explained",
    src: "https://www.youtube.com/embed/spe_mto4gFk?si=yYFaectGX9kX-Cmh",
  },
  {
    title: "Avoid These Foods During Periods",
    src: "https://www.youtube.com/embed/E-8gvJlkY8c?si=Dk8yHMwLy_7RXepg",
  },
  {
    title: "What is PCOD and PCOS?",
    src: "https://www.youtube.com/embed/CCVcTtLQC9U?si=OC9OZz-Azm2XzG5-",
  },
  {
    title: "Your Menstrual Cycle is your superpower",
    src: "https://www.youtube.com/embed/BFa2egx-jI8?si=qVHPfqGukkrrFgJl",
  },
];

const carouselTips = [
  "Apply heat pads or take ibuprofen to relieve menstrual cramps.",
  "Use a menstrual cup to reduce waste and increase comfort.",
  "Keep a period tracker to better understand your cycle.",
];

const Education = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="education-page">
      <header className="education-header">
        <h1>Menstrual Health Education</h1>
        <p>
          Trusted resources to understand your cycle, build healthy routines,
          and make informed menstrual health decisions.
        </p>
      </header>

      {/* Hero */}
      <section className="education-hero-section">
        <div className="container-fluid">
          <div className="education-hero-card">
            <div className="education-hero-image-container">
              <img
                src="/images/tipsbackground.jpeg"
                className="education-hero-image"
                alt="Menstrual wellness tips"
              />
              <div className="overlay-text">
                Learn, track, and care for your health through every phase.
              </div>
            </div>
            <div className="education-tip-grid">
              {carouselTips.map((tip, idx) => (
                <div className="education-tip-chip" key={idx}>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="articles-section">
        <div className="container text-center">
          <h2 className="mb-5 text-center">Featured Articles</h2>
          <p className="section-subtitle">
            Short, practical reads for nutrition, hygiene, hormonal balance, and
            symptom awareness.
          </p>
          <div className="card-container row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {articles.map((a, i) => (
              <div className="article-card col" key={i}>
                <h3 className="mb-3">{a.title}</h3>
                <p className="mb-4">{a.desc}</p>
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Read Article
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="video-section">
        <div className="container text-center">
          <h2 className="text-center mb-5">Educational Videos</h2>
          <p className="section-subtitle">
            Watch quick explainers from trusted channels to better understand
            periods, PCOS, and daily self-care.
          </p>
          <div className="video-container row row-cols-1 row-cols-md-2 row-cols-lg-4">
            {videos.map((v, i) => (
              <div className="video-card col" key={i}>
                <h3>{v.title}</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={v.src}
                  title={v.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="questions-section">
        <div className="container">
          <h2>Common Questions</h2>
          {faqData.map((faq, i) => (
            <div className="question" key={i}>
              <p className="d-inline-flex gap-1">
                <button
                  className="faq-toggle d-flex justify-content-between align-items-center btn p-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}{" "}
                  <i
                    className={`fa-solid fa-${openFaq === i ? "minus" : "plus"}`}
                  ></i>
                </button>
              </p>
              {openFaq === i && <div className="card card-body">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Facts vs Myths */}
      <section className="facts-myths">
        <h2>Facts vs Myths about Menstrual Health</h2>
        <p className="section-subtitle">
          Separate common misconceptions from evidence-based menstrual health
          facts.
        </p>
        {factsMyths.map((fm, i) => (
          <div className="fact-myth-container" key={i}>
            <div className="fact">
              <span className="icon">&#10004;</span>
              <p>{fm.fact}</p>
            </div>
            <div className="myth">
              <span className="icon">&#10008;</span>
              <p>{fm.myth}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quote */}
      <section className="quote-section">
        <div className="container">
          <blockquote>
            &quot;Menstrual health is more than just a cycle; it&apos;s about
            taking care of your overall well-being every day.&quot;
          </blockquote>
          <footer>- Avani Bhawsar</footer>
        </div>
      </section>
    </div>
  );
};

export default Education;
