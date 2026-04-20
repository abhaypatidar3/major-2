import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { chatWithSyncoraAI } from "../services/api";
import "../css/syncoraai.css";

const QUICK_PROMPTS = [
  "I'm having really bad cramps",
  "How to deal with bloating?",
  "Tips for mood swings during PMS",
  "Natural remedies for period headaches",
  "What foods help during periods?",
  "I feel very fatigued on my period",
];

const SyncoraAI = () => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi there! I'm **SyncoraAI** 💜 — your personal menstrual health companion. I'm here to help you with symptom relief, cycle insights, and wellness tips.\n\nYou can tell me what you're experiencing, or pick a topic below to get started! 🌸",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", text: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.role !== "model" || updatedMessages.indexOf(m) !== 0)
        .map((m) => ({ role: m.role, text: m.text }));

      const { data } = await chatWithSyncoraAI(msg, history);
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        "I'm sorry, something went wrong. Please try again in a moment. 💜";

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: apiMessage,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="sai-page">
      {/* Sidebar */}
      <aside className="sai-sidebar">
        <div className="sai-sidebar-top">
          <div className="sai-brand">
            <div className="sai-brand-icon">
              <FaRobot />
            </div>
            <div>
              <h2>SyncoraAI</h2>
              <p>Your health companion</p>
            </div>
          </div>
        </div>

        <div className="sai-sidebar-info">
          <h4>I can help with</h4>
          <ul>
            <li>Period cramps & pain relief</li>
            <li>Bloating & digestive tips</li>
            <li>Mood swing management</li>
            <li>Natural & herbal remedies</li>
            <li>Diet & nutrition advice</li>
            <li>Exercise & yoga during periods</li>
            <li>Cycle tracking insights</li>
            <li>Hygiene & self-care tips</li>
          </ul>
        </div>

        <div className="sai-sidebar-bottom">
          <Link to="/home" className="sai-back-btn">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="sai-main">
        {/* Top bar (mobile) */}
        <div className="sai-topbar">
          <Link to="/home" className="sai-topbar-back">
            <FaArrowLeft />
          </Link>
          <div className="sai-topbar-brand">
            <FaRobot />
            <span>SyncoraAI</span>
          </div>
          <div className="sai-topbar-status">
            <span className="sai-status-dot" />
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="sai-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`sai-msg ${msg.role === "user" ? "sai-msg-user" : "sai-msg-ai"}`}
            >
              <div className="sai-msg-avatar">
                {msg.role === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className="sai-msg-bubble">
                <div
                  className="sai-msg-text"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                />
              </div>
            </div>
          ))}

          {loading && (
            <div className="sai-msg sai-msg-ai">
              <div className="sai-msg-avatar">
                <FaRobot />
              </div>
              <div className="sai-msg-bubble">
                <div className="sai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts (only if few messages) */}
        {messages.length <= 1 && (
          <div className="sai-quick-prompts">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                className="sai-quick-btn"
                onClick={() => sendMessage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="sai-input-bar">
          <div className="sai-input-wrap">
            <textarea
              ref={inputRef}
              className="sai-input"
              placeholder="Tell me how you're feeling..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className={`sai-send-btn ${input.trim() ? "active" : ""}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <FaPaperPlane />
            </button>
          </div>
          <p className="sai-disclaimer">
            SyncoraAI is an AI assistant and not a substitute for professional medical advice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SyncoraAI;
