import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Sparkles,
  LockKeyhole,
  Trash2,
  X
} from "lucide-react";
import "./PrivateSpace.css";

const API = "https://alfaaz-backend-hhts.onrender.com/api/private-alfaaz";

function GaneshSpace() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const deleteEntry = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      setEntries((prev) => prev.filter((item) => item._id !== id));
      setSelected(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="ganesh-space">
      <div className="flower-field" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i}>{i % 2 === 0 ? "✿" : "❀"}</span>
        ))}
      </div>

      <header className="ganesh-header">
        <button onClick={() => navigate("/home")}>
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="ganesh-logo">
          <span>ALFAAZ</span>
          <small>GANESH'S SPACE</small>
        </div>

        <LockKeyhole size={17} strokeWidth={1.4} />
      </header>

      <section className="ganesh-hero">
        <div className="hero-sparkle">
          <Sparkles size={20} strokeWidth={1.2} />
        </div>

        <span className="ganesh-label">MADE JUST FOR YOU</span>

        <h1>
          This is your place,
          <br />
          <em>Ganesh.</em>
        </h1>

        <p>
          For your thoughts, your words,
          <br />
          your memories and all the little things
          <br />
          that feel like you.
        </p>

        <button
          className="enter-ganesh"
          onClick={() => navigate("/private/write")}
        >
          <span>ENTER YOUR SPACE</span>
          <ArrowRight size={17} />
        </button>
      </section>

      <section className="private-words">
        <div className="private-words-heading">
          <div>
            <span>KEPT HERE</span>
            <h2>My Private Words.</h2>
          </div>

          <div className="private-count">
            <LockKeyhole size={14} />
            {entries.length}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="private-empty">
            <Sparkles size={25} />
            <h3>Nothing here yet.</h3>
            <p>
              Your private thoughts will quietly stay here.
            </p>
          </div>
        ) : (
          <div className="private-entries">
            {entries.map((item) => (
              <article className="private-entry" key={item._id}>
                <div className="private-entry-top">
                  <span>{item.type}</span>
                  <LockKeyhole size={13} />
                </div>

                <h3>{item.title}</h3>

                <p>
                  {item.content.length > 150
                    ? `${item.content.slice(0, 150)}...`
                    : item.content}
                </p>

                <div className="private-entry-bottom">
                  <small>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </small>

                  <button onClick={() => setSelected(item)}>
                    Read <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="ganesh-footer">
        <span>✿</span>
        <p>For Ganesh · with a little space for everything.</p>
        <span>✿</span>
      </footer>

      {selected && (
        <div
          className="private-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="private-modal-card">
            <button
              className="private-modal-close"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>

            <span>
              {selected.type} · PRIVATE
            </span>

            <div className="private-modal-lock">
              <LockKeyhole size={18} />
            </div>

            <h2>{selected.title}</h2>

            <div className="private-modal-line" />

            <p>{selected.content}</p>

            <div className="private-modal-footer">
              <small>
                — {selected.author || "Ganesh"}
              </small>

              <button
                onClick={() => deleteEntry(selected._id)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GaneshSpace;