import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  BookOpen,
  Camera,
  LockKeyhole,
  PenLine,
  Save,
  X,
  LogOut
} from "lucide-react";
import "./Profile.css";
import apiRequest from "./api";

function Profile() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Ganesh",
    bio: "A little space for thoughts, words and everything that feels like you."
  });

  const [form, setForm] = useState(profile);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await apiRequest("/alfaaz");
        setEntries(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntries();
  }, []);

  const favorites = entries.filter((item) => item.favorite).length;

  const saveProfile = () => {
    setProfile(form);
    setEditing(false);
  };

  const logout = () => {
    localStorage.removeItem("alfaaz_token");
    navigate("/");
  };

  return (
    <main className="profile-page">
      <header className="profile-header">
        <button onClick={() => navigate("/home")}>
          <ArrowLeft size={17} />
          Home
        </button>

        <div className="profile-brand">
          <span>ALFAAZ</span>
          <small>YOUR SPACE</small>
        </div>

        <button
          className="profile-edit-top"
          onClick={() => {
            setForm(profile);
            setEditing(true);
          }}
        >
          <PenLine size={16} />
        </button>
      </header>

      <section className="profile-hero">
        <div className="profile-avatar">
          <span>G</span>
        </div>

        <span className="profile-label">WELCOME BACK</span>

        <h1>
          Hello, <em>{profile.name}</em>.
        </h1>

        <p>{profile.bio}</p>
      </section>

      <section className="profile-stats">
        <div>
          <BookOpen size={17} />
          <strong>{entries.length}</strong>
          <span>Alfaaz</span>
        </div>

        <div>
          <Heart size={17} />
          <strong>{favorites}</strong>
          <span>Favorites</span>
        </div>

        <div>
          <Camera size={17} />
          <strong>∞</strong>
          <span>Memories</span>
        </div>
      </section>

      <section className="profile-menu">
        <button onClick={() => navigate("/alfaaz")}>
          <div>
            <BookOpen size={18} />
            <span>
              <strong>My Alfaaz</strong>
              <small>Your words & thoughts</small>
            </span>
          </div>
          →
        </button>

        <button onClick={() => navigate("/favorites")}>
          <div>
            <Heart size={18} />
            <span>
              <strong>Favorites</strong>
              <small>Words worth keeping close</small>
            </span>
          </div>
          →
        </button>

        <button onClick={() => navigate("/memories")}>
          <div>
            <Camera size={18} />
            <span>
              <strong>Memories</strong>
              <small>Little moments, kept forever</small>
            </span>
          </div>
          →
        </button>

        <button onClick={() => navigate("/private")}>
          <div>
            <LockKeyhole size={18} />
            <span>
              <strong>Private Space</strong>
              <small>A quieter corner for you</small>
            </span>
          </div>
          →
        </button>

        <button onClick={logout} className="profile-logout">
          <div>
            <LogOut size={18} />
            <span>
              <strong>Logout</strong>
              <small>Leave your Alfaaz space</small>
            </span>
          </div>
          →
        </button>
      </section>

      <footer className="profile-footer">
        <span>✦</span>
        <p>Made for Ganesh · kept in Alfaaz.</p>
        <span>✦</span>
      </footer>

      {editing && (
        <div className="profile-overlay">
          <div className="profile-edit-card">
            <button
              className="profile-close"
              onClick={() => setEditing(false)}
            >
              <X size={18} />
            </button>

            <span>PROFILE</span>
            <h2>Edit your space.</h2>

            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>About</label>
            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              rows="4"
            />

            <button className="profile-save" onClick={saveProfile}>
              <Save size={15} />
              SAVE CHANGES
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile;