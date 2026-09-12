import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Search,
  Sparkles,
  X,
  Trash2,
  BookOpen
} from "lucide-react";
import "./Favorites.css";
import apiRequest from "./api";



function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
  try {
    const data = await apiRequest("/alfaaz");
    setFavorites(data.filter((item) => item.favorite));
  } catch (error) {
    console.error(error);
    alert("Could not load favourites.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
  try {
    await apiRequest(`/alfaaz/${id}`, {
      method: "PUT",
      body: JSON.stringify({ favorite: false })
    });

    setFavorites((prev) =>
      prev.filter((item) => item._id !== id)
    );

    setSelected(null);
  } catch (error) {
    console.error(error);
    alert("Could not remove favourite.");
  }
};
const deleteAlfaaz = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this Alfaaz permanently?"
  );

  if (!confirmDelete) return;

  try {
    await apiRequest(`/alfaaz/${id}`, {
      method: "DELETE"
    });

    setFavorites((prev) =>
      prev.filter((item) => item._id !== id)
    );

    setSelected(null);
  } catch (error) {
    console.error(error);
    alert("Could not delete Alfaaz.");
  }
};

  const surpriseMe = () => {
    if (!favorites.length) return;

    const random =
      favorites[Math.floor(Math.random() * favorites.length)];

    setSelected(random);
  };

  const filteredFavorites = favorites.filter((item) =>
    `${item.title} ${item.content} ${item.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="favorites-page">
      <div className="favorites-decor">
        {["✦", "·", "❋", "✧", "·", "✦", "❁", "·"].map(
          (item, index) => (
            <span key={index}>{item}</span>
          )
        )}
      </div>

      <header className="favorites-header">
        <button
          className="favorites-back"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="favorites-logo">
          <span>ALFAAZ</span>
          <small>THE FAVOURITES</small>
        </div>

        <div className="favorites-count">
          <Heart size={15} />
          {favorites.length}
        </div>
      </header>

      <section className="favorites-intro">
        <div className="favorites-icon">
          <Heart size={21} strokeWidth={1.2} />
        </div>

        <span>WORDS WORTH KEEPING</span>

        <h1>
          My <em>Favourites.</em>
        </h1>

        <p>
          The words that stayed a little longer,
          <br />
          because they meant a little more.
        </p>
      </section>

      <section className="favorites-tools">
        <div className="favorites-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favourites..."
          />
        </div>

        <button
          className="favorites-random"
          onClick={surpriseMe}
          disabled={!favorites.length}
        >
          <Sparkles size={15} />
          Surprise Me
        </button>
      </section>

      <section className="favorites-grid">
        {loading ? (
          <div className="favorites-empty">
            <Heart size={32} />
            <h3>Finding your favourites...</h3>
            <p>Bringing your favourite words here.</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="favorites-empty">
            <Heart size={32} />

            <h3>
              {favorites.length
                ? "No favourites found."
                : "Nothing here yet."}
            </h3>

            <p>
              {favorites.length
                ? "Try another search."
                : "Favourite an Alfaaz and it will appear here."}
            </p>

            {!favorites.length && (
              <button onClick={() => navigate("/alfaaz")}>
                Explore Alfaaz <BookOpen size={15} />
              </button>
            )}
          </div>
        ) : (
          filteredFavorites.map((item) => (
            <article className="favorite-card" key={item._id}>
              <div className="favorite-card-top">
                <span>{item.type}</span>

                <button
                  className="favorite-heart"
                  onClick={() =>
                    removeFavorite(item._id)
                  }
                >
                  <Heart
                    size={17}
                    fill="currentColor"
                  />
                </button>
              </div>

              <div className="favorite-card-content">
                <div className="favorite-mark">“</div>

                <h2>{item.title}</h2>

                <p>{item.content}</p>

                <div className="favorite-author">
                  — {item.author || "Ganesh"}
                </div>
              </div>

              <div className="favorite-card-footer">
                <span>ALFAAZ</span>

                <div className="favorite-actions">
                  <button
                    onClick={() => setSelected(item)}
                  >
                    Read <ArrowLeft size={14} />
                  </button>

                  <button
                    onClick={() =>
                      deleteAlfaaz(item._id)
                    }
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

      <div className="favorites-bottom-note">
        <span>✦</span>
        <p>
          Some words become favourites
          <br />
          because they feel like home.
        </p>
        <span>✦</span>
      </div>

      {selected && (
        <div
          className="favorite-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="favorite-modal-card">
            <button
              className="favorite-close"
              onClick={() => setSelected(null)}
            >
              <X size={19} />
            </button>

            <span>{selected.type} · ALFAAZ</span>

            <div className="favorite-modal-mark">“</div>

            <h2>{selected.title}</h2>

            <div className="favorite-modal-line" />

            <p>{selected.content}</p>

            <div className="favorite-modal-footer">
              <span>
                — {selected.author || "Ganesh"}
              </span>

              <div>
                <button
                  onClick={() =>
                    removeFavorite(selected._id)
                  }
                >
                  <Heart
                    size={15}
                    fill="currentColor"
                  />
                  Unfavourite
                </button>

                <button
                  onClick={() =>
                    deleteAlfaaz(selected._id)
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Favorites;