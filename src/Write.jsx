import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Feather,
  Save,
  Sparkles,
  RotateCcw,
  Flower2
} from "lucide-react";
import "./Write.css";
import apiRequest from "./api";

const types = ["Poetry", "Shayari", "Note", "Thought", "Letter"];

const placeholders = {
  Poetry: "Write a feeling that sounds better as a poem...",
  Shayari: "Aaj dil mein jo alfaaz hain, unhe likh do...",
  Note: "Leave a little note for yourself...",
  Thought: "Write the thought that keeps coming back...",
  Letter: "Dear someone, something I never said..."
};

const prompts = [
  "What are you feeling but not saying?",
  "Write about a moment you wish you could relive.",
  "If today had a title, what would it be?",
  "Write something your future self should remember.",
  "Describe a feeling without naming it."
];

function Write() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [prompt, setPrompt] = useState(prompts[0]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: "Poetry",
    title: "",
    content: ""
  });

  // Load saved draft
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("alfaaz_draft"));
    if (draft) setForm(draft);
  }, []);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem("alfaaz_draft", JSON.stringify(form));
  }, [form]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const selectType = (type) => {
    setForm({ ...form, type });
    setSaved(false);
  };

  const newPrompt = () => {
    const next = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(next);
  };

  const saveEntry = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Give your Alfaaz a title and some words.");
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/alfaaz", {
        method: "POST",
        body: JSON.stringify(form)
      });

      localStorage.removeItem("alfaaz_draft");
      setSaved(true);

      setTimeout(() => navigate("/alfaaz"), 700);
    } catch (error) {
      console.error(error);
      alert("Could not save Alfaaz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const clearPage = () => {
    setForm({
      type: "Poetry",
      title: "",
      content: ""
    });

    localStorage.removeItem("alfaaz_draft");
    setSaved(false);
  };

  return (
    <main className="write-page">
      <div className="flower-field">
        {[
          "✿", "✧", "❀", "·", "✿", "❁", "✧", "❀",
          "·", "✿", "❋", "✧", "❀", "·", "✿", "❁",
          "✧", "✿", "·", "❀", "✧", "❁", "✿", "·",
          "❀", "✧", "✿", "❁", "·", "✿"
        ].map((flower, i) => (
          <span key={i}>{flower}</span>
        ))}
      </div>

      <header className="write-header">
        <button className="write-back" onClick={() => navigate("/home")}>
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="write-logo">
          <span>ALFAAZ</span>
          <small>THE WRITING ROOM</small>
        </div>

        <button
          className="write-save"
          onClick={saveEntry}
          disabled={saving}
        >
          <span>
            {saving ? "Saving..." : saved ? "Saved" : "Save Alfaaz"}
          </span>
          <Save size={15} />
        </button>
      </header>

      <section className="writing-room">
        <div className="room-intro">
          <div className="feather">
            <Feather size={21} />
          </div>

          <span>TAKE YOUR TIME</span>

          <h1>
            Let your thoughts
            <br />
            become <em>Alfaaz.</em>
          </h1>

          <p>
            No perfect words. No rules.
            <br />
            Just write whatever feels worth keeping.
          </p>
        </div>

        <div className="type-selector">
          <small>WHAT ARE YOU WRITING?</small>

          <div>
            {types.map((type) => (
              <button
                key={type}
                className={form.type === type ? "selected" : ""}
                onClick={() => selectType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <section className="paper">
          <div className="paper-decoration">
            <Flower2 size={18} />
          </div>

          <div className="paper-top">
            <span>ALFAAZ / {form.type.toUpperCase()}</span>
            <Sparkles size={15} />
          </div>

          <input
            name="title"
            value={form.title}
            onChange={change}
            placeholder={`A title for your ${form.type.toLowerCase()}...`}
            autoComplete="off"
          />

          <div className="paper-line"></div>

          <textarea
            name="content"
            value={form.content}
            onChange={change}
            placeholder={placeholders[form.type]}
          />

          <div className="paper-bottom">
            <span>{form.content.length} characters</span>

            <button onClick={clearPage}>
              <RotateCcw size={13} />
              Clear page
            </button>
          </div>
        </section>

        <div className="prompt-card">
          <div className="prompt-icon">
            <Sparkles size={17} />
          </div>

          <div>
            <small>NEED A LITTLE PUSH?</small>
            <p>{prompt}</p>
          </div>

          <button onClick={newPrompt}>Another ✦</button>
        </div>

        <div className="writing-tip">
          <span>✿</span>
          <p>
            Some words are not meant to be shared.
            <br />
            They are simply meant to exist.
          </p>
          <span>✿</span>
        </div>
      </section>

      <footer className="write-footer">
        <span>ALFAAZ</span>
        <small>write what stays</small>
      </footer>
    </main>
  );
}

export default Write;