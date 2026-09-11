import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Feather,
  Heart,
  Lightbulb,
  FileText,
  Mail,
  Search,
  X,
  ArrowUpRight
} from "lucide-react";
import "./Collections.css";

const API = "http://localhost:5000/api/alfaaz";

const collectionData = [
  {
    type: "Poetry",
    label: "POETRY",
    title: "Poetry",
    description: "Verses that deserve a quiet place.",
    icon: Feather
  },
  {
    type: "Shayari",
    label: "SHAYARI",
    title: "Shayari",
    description: "A few words, carrying a lot.",
    icon: Heart
  },
  {
    type: "Thought",
    label: "THOUGHTS",
    title: "Thoughts",
    description: "Ideas that stayed a little longer.",
    icon: Lightbulb
  },
  {
    type: "Note",
    label: "NOTES",
    title: "Notes",
    description: "Little things worth remembering.",
    icon: FileText
  },
  {
    type: "Letter",
    label: "LETTERS",
    title: "Letters",
    description: "Words meant for someone special.",
    icon: Mail
  }
];

function Collections() {
  const navigate = useNavigate();

  const [alfaaz, setAlfaaz] = useState([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlfaaz = async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        setAlfaaz(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlfaaz();
  }, []);

  const getCount = (type) =>
    alfaaz.filter((item) => item.type === type).length;

  const activeEntries = useMemo(() => {
    if (!activeType) return [];

    return alfaaz
      .filter((item) => item.type === activeType)
      .filter((item) =>
        `${item.title} ${item.content}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [alfaaz, activeType, search]);

  const totalWords = alfaaz.reduce(
    (total, item) =>
      total + (item.content?.split(/\s+/).length || 0),
    0
  );

  const openCollection = (type) => {
    setActiveType(type);
    setSearch("");
  };

  return (
    <main className="collections-page">

      <div className="collections-glow" />

      <header className="collections-header">
        <button
          className="collections-back"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="collections-logo">
          <span>ALFAAZ</span>
          <small>WORDS · SORTED WITH LOVE</small>
        </div>

        <div className="collections-total">
          <BookOpen size={14} />
          {alfaaz.length}
        </div>
      </header>

      <section className="collections-intro">

        <div className="collections-icon">
          <BookOpen size={21} strokeWidth={1.2} />
        </div>

        <span>EVERY WORD HAS ITS PLACE</span>

        <h1>
          My <em>Collections.</em>
        </h1>

        <p>
          Different moods, different moments,
          <br />
          gathered together in one little space.
        </p>

      </section>

      <section className="collections-stats">

        <div>
          <strong>{alfaaz.length}</strong>
          <span>ALFAAZ</span>
        </div>

        <div>
          <strong>{collectionData.length}</strong>
          <span>COLLECTIONS</span>
        </div>

        <div>
          <strong>{totalWords}</strong>
          <span>WORDS</span>
        </div>

      </section>

      <section className="collections-grid">

        {collectionData.map((collection) => {
          const Icon = collection.icon;
          const count = getCount(collection.type);

          return (
            <button
              className={`collection-card ${
                activeType === collection.type
                  ? "active"
                  : ""
              }`}
              key={collection.type}
              onClick={() => openCollection(collection.type)}
            >
              <div className="collection-card-top">
                <span>{collection.label}</span>

                <ArrowUpRight size={17} />
              </div>

              <div className="collection-card-icon">
                <Icon size={23} strokeWidth={1.2} />
              </div>

              <h2>{collection.title}</h2>

              <p>{collection.description}</p>

              <div className="collection-card-bottom">
                <span>
                  {count} {count === 1 ? "entry" : "entries"}
                </span>

                <small>OPEN</small>
              </div>
            </button>
          );
        })}

      </section>

      {loading && (
        <div className="collections-loading">
          Gathering your words...
        </div>
      )}

      {activeType && (
        <section className="collection-entries-section">

          <div className="entries-heading">

            <div>
              <span>YOUR COLLECTION</span>

              <h2>{activeType}</h2>
            </div>

            <button
              onClick={() => {
                setActiveType(null);
                setSearch("");
              }}
            >
              <X size={17} />
            </button>

          </div>

          <div className="collection-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeType.toLowerCase()}...`}
            />
          </div>

          {activeEntries.length === 0 ? (
            <div className="collection-empty">
              <BookOpen size={28} />

              <h3>
                {search
                  ? "Nothing found."
                  : `No ${activeType.toLowerCase()} yet.`}
              </h3>

              <p>
                {search
                  ? "Try another search."
                  : "Your words will appear here."}
              </p>
            </div>
          ) : (
            <div className="collection-entries">

              {activeEntries.map((item) => (
                <article
                  className="collection-entry-card"
                  key={item._id}
                >
                  <div className="entry-type">
                    {item.type}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.content}</p>

                  <div className="entry-footer">

                    <span>
                      — {item.author || "Ganesh"}
                    </span>

                    <button
                      onClick={() => setSelected(item)}
                    >
                      Read <ArrowUpRight size={14} />
                    </button>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>
      )}

      <footer className="collections-bottom">
        <span>✦</span>

        <p>
          Every collection is a different
          <br />
          corner of the same heart.
        </p>

        <span>✦</span>
      </footer>

      {selected && (
        <div
          className="collection-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="collection-modal-card">

            <button
              className="collection-modal-close"
              onClick={() => setSelected(null)}
            >
              <X size={19} />
            </button>

            <span>{selected.type} · ALFAAZ</span>

            <div className="modal-mark">“</div>

            <h2>{selected.title}</h2>

            <div className="modal-line" />

            <p>{selected.content}</p>

            <div className="modal-author">
              — {selected.author || "Ganesh"}
            </div>

          </div>
        </div>
      )}

    </main>
  );
}

export default Collections;