import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const enterAlfaaz = () => {
    setOpen(true);

    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  return (
    <main className={`landing ${open ? "opened" : ""}`}>
      <div className="landing-glow glow-one"></div>
      <div className="landing-glow glow-two"></div>

      <div className="landing-stars">
        ✦　·　✧　·　✦　·　✧
      </div>

      <section className="landing-content">
        <span className="landing-eyebrow">
          THIS IS YOUR SPACE.
        </span>

        <h1>GANESH</h1>

        <p>
          for thoughts that need
          <br />
          somewhere to stay.
        </p>

        <button onClick={enterAlfaaz}>
          Enter <span>→</span>
        </button>
      </section>
    </main>
  );
}

export default Landing;