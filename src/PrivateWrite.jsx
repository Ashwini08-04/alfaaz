import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Send } from "lucide-react";
import "./PrivateWrite.css";
import apiRequest from "./api";

function PrivateWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "Thought",
    title: "",
    content: ""
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setMessage("Please write a title and your words.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await apiRequest("/private-alfaaz", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm({
        type: "Thought",
        title: "",
        content: ""
      });

      setMessage("Saved privately ✦");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="private-write">
      <header className="private-write-header">
        <button onClick={() => navigate("/private")}>
          <ArrowLeft size={17} />
          Back to Private Space
        </button>

        <div>
          <span>ALFAAZ</span>
          <small>GANESH'S PRIVATE SPACE</small>
        </div>

        <LockKeyhole size={17} />
      </header>

      <section className="private-write-content">
        <span className="private-label">A PRIVATE PAGE</span>

        <h1>
          Write it here,
          <br />
          <em>Ganesh.</em>
        </h1>

        <p className="private-subtitle">
          Some thoughts are meant to stay in one little place.
        </p>

        <form onSubmit={handleSubmit} className="private-form">
          <div className="private-type">
            {["Thought", "Note", "Letter", "Chat"].map((type) => (
              <button
                type="button"
                key={type}
                className={form.type === type ? "active" : ""}
                onClick={() => setForm({ ...form, type })}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Give this thought a little title..."
          />

          <textarea
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            placeholder="Write whatever you want to keep here..."
            rows="9"
          />

          <button className="private-save" type="submit" disabled={saving}>
            <Send size={15} />
            {saving ? "SAVING..." : "SAVE PRIVATELY"}
          </button>

          {message && <p className="private-message">{message}</p>}
        </form>
      </section>
    </main>
  );
}

export default PrivateWrite;