import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Moon,
  Plus,
  Search,
  Sparkles,
  X,
  Trash2,
  Clock3
} from "lucide-react";
import "./LateNight.css";

const API = "http://localhost:5000/api/alfaaz";

function LateNight() {
  const navigate = useNavigate();

  const [thoughts, setThoughts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  const fetchThoughts = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      setThoughts(data.filter((item) => item.lateNight));
    } catch (error) {
      console.error(error);
      alert("Could not load late night thoughts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const change = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setForm({
      title: "",
      content: ""
    });
  };

  const addThought = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Give your thought a title and some words.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "Thought",
          title: form.title,
          content: form.content,
          lateNight: true
        })
      });

      if (!response.ok) throw new Error("Failed");

      const newThought = await response.json();

      setThoughts((prev) => [newThought, ...prev]);
      closeForm();
    } catch (error) {
      console.error(error);
      alert("Could not save thought.");
    } finally {
      setSaving(false);
    }
  };

  const deleteThought = async (id) => {
    if (!window.confirm("Delete this thought permanently?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed");

      setThoughts((prev) =>
        prev.filter((item) => item._id !== id)
      );

      setSelected(null);
    } catch (error) {
      console.error(error);
      alert("Could not delete thought.");
    }
  };

  const surpriseMe = () => {
    if (!thoughts.length) return;

    const random =
      thoughts[Math.floor(Math.random() * thoughts.length)];

    setSelected(random);
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredThoughts = thoughts.filter((item) =>
    `${item.title} ${item.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="late-night-page">
      <div className="late-night-glow" />

      <div className="late-night-stars">
        {["✦", "·", "✧", "·", "✦", "·", "❋", "✧"].map(
          (item, index) => (
            <span key={index}>{item}</span>
          )
        )}
      </div>

      <header className="late-night-header">
        <button
          className="late-night-back"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="late-night-logo">
          <span>ALFAAZ</span>
          <small>AFTER MIDNIGHT</small>
        </div>

        <button
          className="late-night-add"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          New Thought
        </button>
      </header>

      <section className="late-night-intro">
        <div className="moon-icon">
          <Moon size={22} strokeWidth={1.2} />
        </div>

        <span>THOUGHTS THAT ARRIVE AFTER DARK</span>

        <h1>
          Late <em>Night.</em>
        </h1>

        <p>
          When the world gets quiet,
          <br />
          some thoughts finally find their voice.
        </p>
      </section>

      <section className="late-night-stats">
        <div>
          <strong>{thoughts.length}</strong>
          <span>THOUGHTS</span>
        </div>

        <div>
          <strong>☾</strong>
          <span>NIGHTS</span>
        </div>

        <div>
          <strong>✦</strong>
          <span>WORDS</span>
        </div>
      </section>

      <section className="late-night-tools">
        <div className="late-night-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search late night thoughts..."
          />
        </div>

        <button
          className="late-night-random"
          onClick={surpriseMe}
          disabled={!thoughts.length}
        >
          <Sparkles size={15} />
          Surprise Me
        </button>
      </section>

      <section className="late-night-grid">
        {loading ? (
          <div className="late-night-empty">
            <Moon size={32} />
            <h3>Waiting for midnight thoughts...</h3>
            <p>Bringing your quiet words here.</p>
          </div>
        ) : filteredThoughts.length === 0 ? (
          <div className="late-night-empty">
            <Moon size={32} />

            <h3>
              {thoughts.length
                ? "No thoughts found."
                : "The night is still quiet."}
            </h3>

            <p>
              {thoughts.length
                ? "Try another search."
                : "Write something you only think about at night."}
            </p>

            {!thoughts.length && (
              <button onClick={() => setShowForm(true)}>
                Write Tonight <Plus size={15} />
              </button>
            )}
          </div>
        ) : (
          filteredThoughts.map((item) => (
            <article className="late-night-card" key={item._id}>
              <div className="late-night-card-top">
                <span>THOUGHT · AFTER DARK</span>

                <div className="late-night-time">
                  <Clock3 size={12} />
                  {formatTime(item.createdAt)}
                </div>
              </div>

              <div className="late-night-card-content">
                <div className="late-night-mark">“</div>

                <h2>{item.title}</h2>

                <p>{item.content}</p>
              </div>

              <div className="late-night-card-footer">
                <span>ALFAAZ · NIGHT</span>

                <div className="late-night-actions">
                  <button onClick={() => setSelected(item)}>
                    Read <ArrowLeft size={14} />
                  </button>

                  <button
                    onClick={() => deleteThought(item._id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <div className="late-night-bottom">
        <span>☾</span>
        <p>
          Some thoughts only appear
          <br />
          when everything else goes quiet.
        </p>
        <span>✦</span>
      </div>

      {showForm && (
        <div className="late-night-modal">
          <div className="late-night-modal-card">
            <button
              className="late-night-close"
              onClick={closeForm}
            >
              <X size={19} />
            </button>

            <div className="modal-moon">
              <Moon size={20} />
            </div>

            <span>AFTER DARK</span>

            <h2>
              Write what
              <br />
              <em>keeps you awake.</em>
            </h2>

            <form onSubmit={addThought}>
              <input
                name="title"
                value={form.title}
                onChange={change}
                placeholder="Thought title..."
              />

              <textarea
                name="content"
                value={form.content}
                onChange={change}
                placeholder="Write what's on your mind..."
              />

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Thought"}
                <Moon size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="late-night-view"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="late-night-view-card">
            <button
              className="late-night-view-close"
              onClick={() => setSelected(null)}
            >
              <X size={19} />
            </button>

            <span>ALFAAZ · AFTER DARK</span>

            <div className="view-moon">
              <Moon size={22} />
            </div>

            <h2>{selected.title}</h2>

            <div className="late-night-view-line" />

            <p>{selected.content}</p>

            <div className="late-night-view-footer">
              <span>— Ganesh · {formatTime(selected.createdAt)}</span>

              <button
                onClick={() => deleteThought(selected._id)}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LateNight;