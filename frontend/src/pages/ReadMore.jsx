import "../css/readmore.css";

const ReadMore = () => {
  return (
    <div className="readmore-page">
      <section>
        <div className="img-box-left"><img src="/images/service-2.jpg" alt="Symptoms" /></div>
        <div className="symptoms">
          <h1>Symptom Based Solutions</h1>
          <p>
            The feature is designed to give you personalized care and support. By simply selecting 
            the symptoms you&apos;re experiencing, such as cramps, headaches, or other discomforts, 
            you&apos;ll receive tailored advice and remedies that fit your specific needs. Whether 
            it&apos;s tips to relieve pain, natural remedies to soothe your symptoms, or suggestions 
            to feel better overall, this feature empowers you to take charge of your well-being.
          </p>
        </div>
      </section>

      <section>
        <div className="period-cal">
          <h1>Period Calculator</h1>
          <p>
            The Menstrual Cycle Tracker makes it simple to stay on top of your health. You can easily 
            record your cycle dates, track your moods, and log how you feel each day. This helps you 
            get a clear picture of your body&apos;s patterns and understand how your mood and health 
            change throughout your cycle. The tracker also gives you personalized predictions for your 
            next period and other important cycle phases, so you can plan ahead with confidence.
          </p>
        </div>
        <div className="img-box-right"><img src="/images/service-3.jpg" alt="Period Calculator" /></div>
      </section>

      <section>
        <div className="img-box-left"><img src="/images/service-4.png" alt="Education" /></div>
        <div className="education">
          <h1>Educational Content</h1>
          <p>
            The Health Education Section is your go-to resource for understanding and improving your 
            health. We provide simple, helpful information on topics like menstrual health and overall 
            wellness, so you can take better care of yourself. This section is all about giving you 
            the knowledge you need to make smart choices for your health.
          </p>
        </div>
      </section>

      <section>
        <div className="community">
          <h1>Community Discussion Chats</h1>
          <p>
            The Community Discussion Chats offer a warm, safe space where you can connect with others 
            who share similar health and wellness goals. It&apos;s a place to talk openly, share your 
            experiences, and exchange helpful tips in a supportive environment.
          </p>
        </div>
        <div className="img-box-right"><img src="/images/commu.jpg" alt="Community" /></div>
      </section>
    </div>
  );
};

export default ReadMore;
