import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Heart,
  Trash2,
  BookOpen,
  Sparkles,
  Feather,
  PenLine
} from "lucide-react";
import "./Alfaaz.css";

const filters = ["All", "Poetry", "Shayari", "Note", "Thought", "Letter"];

function Alfaaz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [entries, setEntries] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [randomEntry, setRandomEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Alfaaz from MongoDB
  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/alfaaz");

      if (!response.ok) {
        throw new Error("Failed to fetch Alfaaz");
      }

      const data = await response.json();
      setEntries(data);

      // Open random Alfaaz when coming from Home Surprise Me
      if (searchParams.get("random") === "true" && data.length) {
        const random =
          data[Math.floor(Math.random() * data.length)];

        setRandomEntry(random);
      }
    } catch (error) {
      console.error(error);
      alert("Could not load Alfaaz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesType =
        activeFilter === "All" || entry.type === activeFilter;

      const text =
        `${entry.title} ${entry.content}`.toLowerCase();

      return matchesType && text.includes(search.toLowerCase());
    });
  }, [entries, activeFilter, search]);

  const toggleFavorite = async (id, favorite) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/alfaaz/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ favorite: !favorite })
        }
      );

      if (!response.ok) throw new Error("Failed");

      setEntries((prev) =>
        prev.map((entry) =>
          entry._id === id
            ? { ...entry, favorite: !favorite }
            : entry
        )
      );

      if (randomEntry?._id === id) {
        setRandomEntry((prev) => ({
          ...prev,
          favorite: !favorite
        }));
      }
    } catch (error) {
      alert("Could not update favorite.");
    }
  };

  const deleteEntry = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this Alfaaz permanently?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/alfaaz/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) throw new Error("Failed");

      setEntries((prev) =>
        prev.filter((entry) => entry._id !== id)
      );

      if (randomEntry?._id === id) {
        setRandomEntry(null);
      }
    } catch (error) {
      alert("Could not delete Alfaaz.");
    }
  };

  const openEntry = (entry) => {
    localStorage.setItem(
      "selected_alfaaz",
      JSON.stringify(entry)
    );

    navigate("/read");
  };

  const surpriseMe = () => {
    if (!entries.length) return;

    const random =
      entries[Math.floor(Math.random() * entries.length)];

    setRandomEntry(random);
  };

  const favoriteCount = entries.filter(
    (entry) => entry.favorite
  ).length;

  const typeCount = new Set(
    entries.map((entry) => entry.type)
  ).size;

  return (
    <main className="alfaaz-page">
      <div className="flower-field">
        {[
          "✿", "✧", "❀", "·", "✿", "❁", "✧", "❀",
          "·", "✿", "❋", "✧", "❀", "·", "✿", "❁",
          "✧", "✿", "·", "❀", "✧", "❁", "✿", "·"
        ].map((flower, i) => (
          <span key={i}>{flower}</span>
        ))}
      </div>

      <header className="alfaaz-header">
        <button
          className="alfaaz-back"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="alfaaz-logo">
          <span>ALFAAZ</span>
          <small>GANESH'S PRIVATE PAGES</small>
        </div>

        <button
          className="new-alfaaz-btn"
          onClick={() => navigate("/write")}
        >
          <PenLine size={15} />
          Write
        </button>
      </header>

      <section className="alfaaz-content">
        <div className="alfaaz-intro">
          <div className="alfaaz-feather">
            <Feather size={20} />
          </div>

          <span>THE COLLECTION</span>

          <h1>
            My <em>Alfaaz.</em>
          </h1>

          <p>
            Words written somewhere between
            <br />
            thought, feeling and silence.
          </p>
        </div>

        <div className="alfaaz-stats">
          <div>
            <strong>{entries.length}</strong>
            <span>ALFAAZ</span>
          </div>

          <div>
            <strong>{favoriteCount}</strong>
            <span>FAVOURITES</span>
          </div>

          <div>
            <strong>{typeCount}</strong>
            <span>FORMS</span>
          </div>
        </div>

        <div className="alfaaz-tools">
          <div className="search-box">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your words..."
            />
          </div>

          <button
            className="surprise-btn"
            onClick={surpriseMe}
            disabled={!entries.length}
          >
            <Sparkles size={15} />
            Surprise Me
          </button>
        </div>

        <div className="alfaaz-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter ? "active" : ""
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {randomEntry && (
          <section className="random-alfaaz">
            <div>
              <small>A LITTLE SOMETHING ✦</small>

              <h3>{randomEntry.title}</h3>

              <p>
                {randomEntry.content.slice(0, 180)}
                {randomEntry.content.length > 180
                  ? "..."
                  : ""}
              </p>
            </div>

            <button
              onClick={() => openEntry(randomEntry)}
            >
              Read
            </button>
          </section>
        )}

        {loading ? (
          <div className="empty-alfaaz">
            <BookOpen size={30} />
            <h3>Opening your pages...</h3>
            <p>Your Alfaaz are being brought here.</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="empty-alfaaz">
            <Feather size={32} />

            <h3>
              {entries.length
                ? "Nothing found."
                : "Your pages are waiting."}
            </h3>

            <p>
              {entries.length
                ? "Try another search or category."
                : "Write your first Alfaaz and let it stay here."}
            </p>

            {!entries.length && (
              <button onClick={() => navigate("/write")}>
                Write First Alfaaz ✦
              </button>
            )}
          </div>
        ) : (
          <div className="entries-grid">
            {filteredEntries.map((entry) => (
              <article
                className="entry-card"
                key={entry._id}
              >
                <div className="entry-card-top">
                  <span>{entry.type}</span>

                  <button
                    className={
                      entry.favorite
                        ? "favorite active"
                        : "favorite"
                    }
                    onClick={() =>
                      toggleFavorite(
                        entry._id,
                        entry.favorite
                      )
                    }
                  >
                    <Heart
                      size={16}
                      fill={
                        entry.favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <h2>{entry.title}</h2>

                <span className="entry-author">
                  Written by Ganesh
                </span>

                <p>
                  {entry.content.slice(0, 220)}
                  {entry.content.length > 220
                    ? "..."
                    : ""}
                </p>

                <div className="entry-card-bottom">
                  <small>
                    {new Date(
                      entry.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </small>

                  <div className="entry-actions">
                    <button
                      onClick={() => openEntry(entry)}
                    >
                      <BookOpen size={14} />
                      Open
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteEntry(entry._id)
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="alfaaz-bottom-note">
          <span>✿</span>

          <p>
            Every page holds a little piece
            <br />
            of the person who wrote it.
          </p>

          <span>✿</span>
        </div>
      </section>
    </main>
  );
}

export default Alfaaz;