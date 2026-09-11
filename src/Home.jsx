import {
  BookOpen,
  Heart,
  PenLine,
  Camera,
  Moon,
  CalendarDays,
  Star,
  LockKeyhole,
  ArrowUpRight,
  Sparkles,
  Leaf,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const cards = [
  {
    icon: BookOpen,
    title: "My Alfaaz",
    text: "All your words, gathered in one little world.",
    path: "/alfaaz"
  },
  {
    icon: Heart,
    title: "Favorites",
    text: "Words that are worth keeping close.",
    path: "/favorites"
  },
  {
    icon: Camera,
    title: "Memories",
    text: "Little moments you never want to forget.",
    path: "/memories"
  },
  {
    icon: Moon,
    title: "Late Night",
    text: "For thoughts that arrive after midnight.",
    path: "/late-night"
  }
];

const bottomCards = [
  {
    icon: CalendarDays,
    title: "Calendar",
    text: "Revisit your words by date.",
    path: "/calendar"
  },
  {
    icon: Star,
    title: "Collections",
    text: "Keep your favorite themes together.",
    path: "/collections"
  },
  {
    icon: LockKeyhole,
    title: "Private Space",
    text: "For words meant only for you.",
    path: "/private"
  }
];

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">

      {/* Floral background */}
      <div className="flower-bg">
        {[
          "✿", "✧", "✿", "·", "✿", "✧",
          "·", "✿", "✧", "✿", "·", "✿",
          "✧", "✿", "·", "✧", "✿", "·"
        ].map((flower, i) => (
          <span key={i}>{flower}</span>
        ))}
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="home-brand">
          <span>ALFAAZ</span>
          <small>a place for your words</small>
        </div>

        {/* Profile */}
        <button
          className="profile-btn"
          onClick={() => navigate("/profile")}
          aria-label="Open Profile"
        >
          <User size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="hero-symbol">
          <Leaf size={18} strokeWidth={1.2} />
        </div>

        <p className="hero-label">WELCOME BACK, GANESH</p>

        <h1>
          Your words,
          <br />
          <em>your little world.</em>
        </h1>

        <p className="hero-text">
          A quiet place for everything you feel,
          <br />
          remember and want to keep.
        </p>

        <button
          className="write-button"
          onClick={() => navigate("/write")}
        >
          <PenLine size={17} />
          Write Something
          <ArrowUpRight size={16} />
        </button>
      </section>

      {/* Library */}
      <section className="library">
        <div className="section-title">
          <span>YOUR LITTLE LIBRARY</span>
          <h2>Everything you leave behind in words.</h2>
        </div>

        <div className="library-grid">

          {/* Featured write card */}
          <article
            className="featured-card"
            onClick={() => navigate("/write")}
          >
            <div className="featured-line"></div>

            <div className="featured-top">
              <span>START A NEW PAGE</span>
              <PenLine size={20} />
            </div>

            <div className="featured-content">
              <small>What is on your mind?</small>

              <h3>
                Turn it into
                <br />
                <em>Alfaaz.</em>
              </h3>
            </div>

            <div className="featured-bottom">
              <span>Write something you want to remember.</span>
              <ArrowUpRight size={19} />
            </div>

            <div className="featured-circle"></div>
          </article>

          {/* Main cards */}
          <div className="small-cards">
            {cards.map(({ icon: Icon, title, text, path }, i) => (
              <article
                className={`home-card ${path ? "clickable" : ""}`}
                key={title}
                onClick={() => path && navigate(path)}
              >
                <div className="card-number">
                  0{i + 1}
                </div>

                <div className="card-icon">
                  <Icon size={18} strokeWidth={1.3} />
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

                <ArrowUpRight
                  className="card-arrow"
                  size={17}
                />
              </article>
            ))}
          </div>
        </div>

        {/* Bottom cards */}
        <div className="bottom-cards">
          {bottomCards.map(
            ({ icon: Icon, title, text, path }) => (
              <article
                className={`bottom-card ${path ? "clickable" : ""}`}
                key={title}
                onClick={() => path && navigate(path)}
              >
                <Icon size={20} strokeWidth={1.2} />

                <div>
                  <span>{title}</span>
                  <p>{text}</p>
                </div>

                <ArrowUpRight
                  className="card-arrow"
                  size={16}
                />
              </article>
            )
          )}
        </div>
      </section>

      {/* Random Alfaaz */}
      <section className="random-section">
        <div className="random-orbit">
          <Sparkles size={18} strokeWidth={1.2} />
        </div>

        <span>RANDOM ALFAAZ</span>

        <h2>
          Let your own words
          <br />
          <em>surprise you.</em>
        </h2>

        <p>
          Open a random piece from your little collection
          <br />
          and see where your words take you.
        </p>

        <button
  className="outline-button"
  onClick={() => navigate("/alfaaz?random=true")}
>
          Surprise Me
          <ArrowUpRight size={16} />
        </button>
      </section>

      {/* On This Day */}
      <section className="on-day">
        <div className="day-label">
          <i></i>
          <CalendarDays size={15} strokeWidth={1.2} />
          ON THIS DAY
          <i></i>
        </div>

        <h2>A little piece of your past.</h2>

        <p>
          Some moments deserve to be visited more than once.
        </p>

        <button
          className="outline-button"
          onClick={() => navigate("/memories")}
        >
          Explore Memories
          <ArrowUpRight size={16} />
        </button>
      </section>

      {/* Quote */}
      <section className="home-quote">
        <div className="quote-mark">“</div>

        <p>
          Some thoughts are too beautiful
          <br />
          to be left unsaid.
        </p>

        <small>— ALFAAZ</small>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <strong>ALFAAZ</strong>

        <p>
          made for thoughts that need somewhere to stay.
        </p>
      </footer>

    </main>
  );
}

export default Home;