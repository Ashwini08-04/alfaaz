import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Feather,
  BookOpen
} from "lucide-react";
import "./ReadAlfaaz.css";

function ReadAlfaaz() {
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("selected_alfaaz");

    if (!saved) {
      setLoading(false);
      return;
    }

    const selected = JSON.parse(saved);

    const loadEntry = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/alfaaz/${selected._id}`
        );

        if (!response.ok) throw new Error("Entry not found");

        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error(error);
        setEntry(selected);
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, []);

  const toggleFavorite = async () => {
    if (!entry) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/alfaaz/${entry._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            favorite: !entry.favorite
          })
        }
      );

      if (!response.ok) throw new Error("Failed");

      const updated = await response.json();
      setEntry(updated);

      localStorage.setItem(
        "selected_alfaaz",
        JSON.stringify(updated)
      );
    } catch (error) {
      alert("Could not update favorite.");
    }
  };

  const shareAlfaaz = async () => {
    if (!entry) return;

    const text = `${entry.title}\n\n${entry.content}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: entry.title,
          text
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Alfaaz copied ✨");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  if (loading) {
    return (
      <main className="read-page">
        <div className="read-loading">
          <Feather size={28} />
          <p>Opening your Alfaaz...</p>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="read-page">
        <div className="read-empty">
          <BookOpen size={35} />
          <h2>No Alfaaz selected</h2>
          <p>Open an Alfaaz from your collection.</p>

          <button onClick={() => navigate("/alfaaz")}>
            <ArrowLeft size={15} />
            My Alfaaz
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="read-page">
      <div className="read-flower-field">
        {[
          "✿", "✧", "❀", "·", "❁", "✿", "✧", "❀",
          "·", "✿", "❋", "✧", "❀", "·", "❁", "✿"
        ].map((flower, i) => (
          <span key={i}>{flower}</span>
        ))}
      </div>

      <header className="read-header">
        <button
          onClick={() => navigate("/alfaaz")}
          className="read-back"
        >
          <ArrowLeft size={17} />
          <span>My Alfaaz</span>
        </button>

        <div className="read-logo">
          <span>ALFAAZ</span>
          <small>READING ROOM</small>
        </div>

        <button
          className={
            entry.favorite
              ? "read-favorite active"
              : "read-favorite"
          }
          onClick={toggleFavorite}
        >
          <Heart
            size={17}
            fill={entry.favorite ? "currentColor" : "none"}
          />
        </button>
      </header>

      <section className="reading-room">
        <article className="reading-paper">
          <div className="reading-paper-top">
            <span>
              ALFAAZ / {entry.type.toUpperCase()}
            </span>

            <Feather size={17} />
          </div>

          <div className="reading-heading">
            <small>
              {entry.createdAt
                ? new Date(entry.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    }
                  )
                : ""}
            </small>

            <h1>{entry.title}</h1>

            <div className="heading-line"></div>
          </div>

          <div className="reading-content">
            {entry.content.split("\n").map((line, index) => (
              <p key={index}>
                {line || "\u00A0"}
              </p>
            ))}
          </div>

          <div className="written-by">
            <span>✿</span>
            <div>
              <small>WRITTEN BY</small>
              <strong>{entry.author || "Ganesh"}</strong>
            </div>
            <span>✿</span>
          </div>
        </article>

        <div className="reading-actions">
          <button onClick={toggleFavorite}>
            <Heart
              size={15}
              fill={entry.favorite ? "currentColor" : "none"}
            />
            {entry.favorite
              ? "Saved to favourites"
              : "Add to favourites"}
          </button>

          <button onClick={shareAlfaaz}>
            <Share2 size={15} />
            Share
          </button>
        </div>

        <button
          className="back-collection"
          onClick={() => navigate("/alfaaz")}
        >
          <ArrowLeft size={14} />
          Back to My Alfaaz
        </button>
      </section>
    </main>
  );
}

export default ReadAlfaaz;