import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Plus,
  Search,
  Heart,
  CalendarDays,
  Sparkles,
  X,
  Trash2
} from "lucide-react";
import "./Memories.css";

const API = "https://alfaaz-backend-hhts.onrender.com/api/memories";

function Memories() {
  const navigate = useNavigate();

  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: "",
    text: "",
    image: null
  });

  const fetchMemories = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch memories");
      }

      const data = await response.json();
      setMemories(data);
    } catch (error) {
      console.error(error);
      alert("Could not load memories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const chooseImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null
    }));

    setImagePreview("");
  };

  const addMemory = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.text.trim()) {
      alert("Give your memory a title and some words.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("date", form.date);
      data.append("text", form.text);

      if (form.image) {
        data.append("image", form.image);
      }

      const response = await fetch(API, {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        throw new Error("Failed to create memory");
      }

      const newMemory = await response.json();

      setMemories((prev) => [newMemory, ...prev]);

      setForm({
        title: "",
        date: "",
        text: "",
        image: null
      });

      setImagePreview("");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Could not save memory.");
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async (id, favorite) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          favorite: !favorite
        })
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      const updated = await response.json();

      setMemories((prev) =>
        prev.map((memory) =>
          memory._id === id ? updated : memory
        )
      );

      setSelectedMemory((prev) =>
        prev?._id === id ? updated : prev
      );
    } catch (error) {
      console.error(error);
      alert("Could not update favorite.");
    }
  };

  const deleteMemory = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this memory permanently?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setMemories((prev) =>
        prev.filter((memory) => memory._id !== id)
      );

      if (selectedMemory?._id === id) {
        setSelectedMemory(null);
      }
    } catch (error) {
      console.error(error);
      alert("Could not delete memory.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "A day to remember";

    const [year, month, day] = date.split("-");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const filteredMemories = memories.filter((memory) =>
    `${memory.title} ${memory.text}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const favoriteCount = memories.filter(
    (memory) => memory.favorite
  ).length;

  const surpriseMe = () => {
    if (!memories.length) return;

    const random =
      memories[Math.floor(Math.random() * memories.length)];

    setSelectedMemory(random);
  };

  return (
    <main className="memories-page">
      {/* Decorative background */}
      <div className="memory-flower-field">
        {[
          "✿",
          "✧",
          "❀",
          "·",
          "✿",
          "❁",
          "✧",
          "❀",
          "·",
          "✿",
          "❋",
          "✧",
          "❀",
          "·",
          "❁",
          "✿"
        ].map((flower, i) => (
          <span key={i}>{flower}</span>
        ))}
      </div>

      {/* Header */}
      <header className="memories-header">
        <button
          className="memory-back"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="memory-logo">
          <span>ALFAAZ</span>
          <small>THE MEMORY ROOM</small>
        </div>

        <button
          className="add-memory-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          New Memory
        </button>
      </header>

      {/* Intro */}
      <section className="memories-intro">
        <div className="memory-symbol">
          <Camera size={21} strokeWidth={1.2} />
        </div>

        <span>THE LITTLE MOMENTS</span>

        <h1>
          My <em>Memories.</em>
        </h1>

        <p>
          Some moments pass quietly,
          <br />
          but deserve to stay forever.
        </p>
      </section>

      {/* Stats */}
      <section className="memory-stats">
        <div>
          <strong>{memories.length}</strong>
          <span>MEMORIES</span>
        </div>

        <div>
          <strong>{favoriteCount}</strong>
          <span>FAVOURITES</span>
        </div>

        <div>
          <strong>✦</strong>
          <span>MOMENTS</span>
        </div>
      </section>

      {/* Search */}
      <section className="memory-tools">
        <div className="memory-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories..."
          />
        </div>

        <button
          className="memory-random"
          onClick={surpriseMe}
          disabled={!memories.length}
        >
          <Sparkles size={15} />
          Surprise Me
        </button>
      </section>

      {/* Memory Cards */}
      <section className="memories-grid">
        {loading ? (
          <div className="memory-empty">
            <Camera size={32} />

            <h3>Opening your memories...</h3>

            <p>Bringing your little moments here.</p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="memory-empty">
            <Camera size={32} />

            <h3>
              {memories.length
                ? "No memories found."
                : "Your memories are waiting."}
            </h3>

            <p>
              {memories.length
                ? "Try another search."
                : "Save your first little moment here."}
            </p>

            {!memories.length && (
              <button onClick={() => setShowForm(true)}>
                Add Memory ✦
              </button>
            )}
          </div>
        ) : (
          filteredMemories.map((memory) => (
            <article
              className="memory-card"
              key={memory._id}
            >
              <div className="memory-card-top">
                <span>
                  <CalendarDays size={13} />
                  {formatDate(memory.date)}
                </span>

                <button
                  className={
                    memory.favorite
                      ? "memory-heart active"
                      : "memory-heart"
                  }
                  onClick={() =>
                    toggleFavorite(
                      memory._id,
                      memory.favorite
                    )
                  }
                >
                  <Heart
                    size={16}
                    fill={
                      memory.favorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {/* Photo */}
              <div className="memory-photo">
                {memory.imageUrl ? (
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                  />
                ) : (
                  <>
                    <Camera
                      size={24}
                      strokeWidth={1.1}
                    />
                    <small>A MOMENT TO KEEP</small>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="memory-card-content">
                <small>MEMORY</small>

                <h2>{memory.title}</h2>

                <p>{memory.text}</p>
              </div>

              {/* Footer */}
              <div className="memory-card-footer">
                <span>ALFAAZ</span>

                <div className="memory-actions">
                  <button
                    onClick={() =>
                      setSelectedMemory(memory)
                    }
                  >
                    Open Memory
                    <ArrowLeft size={14} />
                  </button>

                  <button
                    onClick={() =>
                      deleteMemory(memory._id)
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

      {/* Bottom Note */}
      <div className="memory-bottom-note">
        <span>✿</span>

        <p>
          Some memories are not about what happened.
          <br />
          They are about how it felt.
        </p>

        <span>✿</span>
      </div>

      {/* New Memory Modal */}
      {showForm && (
        <div className="memory-modal">
          <div className="memory-modal-card">
            <button
              className="close-memory"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
            </button>

            <div className="modal-icon">
              <Camera size={20} />
            </div>

            <span>NEW MEMORY</span>

            <h2>
              Keep this moment
              <br />
              <em>somewhere safe.</em>
            </h2>

            <form onSubmit={addMemory}>
              {/* Photo Upload */}
              <label className="memory-upload">
                <Camera size={18} />

                <span>
                  {form.image
                    ? "Change Photo"
                    : "Add a Photo"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={chooseImage}
                />
              </label>

              {/* Preview */}
              {imagePreview && (
                <div className="memory-preview">
                  <img
                    src={imagePreview}
                    alt="Selected memory"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* Title */}
              <input
                name="title"
                value={form.title}
                onChange={change}
                placeholder="Memory title..."
              />

              {/* Date */}
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={change}
              />

              {/* Memory */}
              <textarea
                name="text"
                value={form.text}
                onChange={change}
                placeholder="Write what you want to remember..."
              />

              <button
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Memory"}
                <Plus size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Open Memory */}
      {selectedMemory && (
        <div
          className="memory-view-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedMemory(null);
            }
          }}
        >
          <div className="memory-view-card">
            <button
              className="memory-view-close"
              onClick={() => setSelectedMemory(null)}
            >
              <X size={19} />
            </button>

            {selectedMemory.imageUrl && (
              <div className="memory-view-image">
                <img
                  src={selectedMemory.imageUrl}
                  alt={selectedMemory.title}
                />
              </div>
            )}

            <div className="memory-view-content">
              <span>ALFAAZ · MEMORY</span>

              <h2>{selectedMemory.title}</h2>

              <div className="memory-view-date">
                <CalendarDays size={14} />
                {formatDate(selectedMemory.date)}
              </div>

              <div className="memory-view-line" />

              <p>{selectedMemory.text}</p>

              <div className="memory-view-footer">
                <span>✦ A moment worth keeping</span>

                <button
                  onClick={() =>
                    toggleFavorite(
                      selectedMemory._id,
                      selectedMemory.favorite
                    )
                  }
                >
                  <Heart
                    size={15}
                    fill={
                      selectedMemory.favorite
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {selectedMemory.favorite
                    ? "Favourited"
                    : "Favourite"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Memories;