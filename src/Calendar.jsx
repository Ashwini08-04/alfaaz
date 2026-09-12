import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  BookOpen,
  Camera,
  X
} from "lucide-react";
import "./Calendar.css";
import apiRequest from "./api";

function Calendar() {
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [alfaaz, setAlfaaz] = useState([]);
  const [memories, setMemories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthName = date.toLocaleString("en-IN", {
    month: "long"
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alfaazData, memoryData] = await Promise.all([
          apiRequest("/alfaaz"),
          apiRequest("/memories")
        ]);

        setAlfaaz(alfaazData);
        setMemories(memoryData);
      } catch (error) {
        console.error("Calendar error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  const getDayData = (day) => {
    const key = formatDate(day);

    const words = alfaaz.filter(
      (item) => item.createdAt?.slice(0, 10) === key
    );

    const memory = memories.filter(
      (item) => item.date === key
    );

    return { words, memory };
  };

  const previousMonth = () => {
    setDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const today = () => {
    setDate(new Date());
    setSelectedDate(null);
  };

  const selectedData = selectedDate
    ? getDayData(Number(selectedDate.split("-")[2]))
    : null;

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    )
  ];

  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <main className="calendar-page">
      {/* Decorative teddy */}
      <div className="calendar-teddy">
        <div className="teddy-ear teddy-ear-left">
          <span />
        </div>

        <div className="teddy-ear teddy-ear-right">
          <span />
        </div>

        <div className="teddy-head">
          <div className="teddy-eye teddy-eye-left" />
          <div className="teddy-eye teddy-eye-right" />

          <div className="teddy-cheek teddy-cheek-left" />
          <div className="teddy-cheek teddy-cheek-right" />

          <div className="teddy-muzzle">
            <div className="teddy-nose" />
            <div className="teddy-mouth" />
          </div>
        </div>

        <div className="teddy-body">
          <div className="teddy-belly" />
        </div>

        <div className="teddy-arm teddy-arm-left" />
        <div className="teddy-arm teddy-arm-right" />

        <div className="teddy-foot teddy-foot-left" />
        <div className="teddy-foot teddy-foot-right" />
      </div>

      <div className="calendar-glow" />

      <header className="calendar-header">
        <button
          className="calendar-back"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={17} />
          <span>Home</span>
        </button>

        <div className="calendar-logo">
          <span>ALFAAZ</span>
          <small>YOUR DAYS · YOUR WORDS</small>
        </div>

        <button
          className="calendar-today"
          onClick={today}
        >
          Today
        </button>
      </header>

      <section className="calendar-intro">
        <div className="calendar-icon">
          <CalendarDays size={22} strokeWidth={1.2} />
        </div>

        <span>A LITTLE SPACE FOR EVERY DAY</span>

        <h1>
          Your <em>Calendar.</em>
        </h1>

        <p>
          Days pass quietly,
          <br />
          but the moments worth keeping stay.
        </p>
      </section>

      <section className="calendar-wrap">
        <div className="calendar-card">
          <div className="calendar-month-head">
            <button onClick={previousMonth}>
              <ChevronLeft size={19} />
            </button>

            <div>
              <h2>{monthName}</h2>
              <span>{year}</span>
            </div>

            <button onClick={nextMonth}>
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <span key={day}>{day}</span>
              )
            )}
          </div>

          <div className="calendar-days">
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <div
                    className="calendar-empty"
                    key={`empty-${index}`}
                  />
                );
              }

              const key = formatDate(day);
              const data = getDayData(day);

              const hasAlfaaz = data.words.length > 0;
              const hasMemory = data.memory.length > 0;
              const isToday = key === todayKey;

              return (
                <button
                  key={key}
                  className={`calendar-day ${
                    isToday ? "is-today" : ""
                  } ${
                    selectedDate === key ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedDate(key)}
                >
                  <span>{day}</span>

                  {(hasAlfaaz || hasMemory) && (
                    <div className="calendar-dots">
                      {hasAlfaaz && (
                        <i className="word-dot" />
                      )}

                      {hasMemory && (
                        <i className="memory-dot" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span>
              <i className="word-dot" />
              Alfaaz
            </span>

            <span>
              <i className="memory-dot" />
              Memories
            </span>
          </div>
        </div>
      </section>

      {loading && (
        <div className="calendar-loading">
          Opening your days...
        </div>
      )}

      {selectedDate && selectedData && (
        <div
          className="calendar-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDate(null);
            }
          }}
        >
          <div className="calendar-day-modal">
            <button
              className="calendar-modal-close"
              onClick={() => setSelectedDate(null)}
            >
              <X size={18} />
            </button>

            <span className="modal-label">
              ON THIS DAY
            </span>

            <h2>
              {new Date(
                `${selectedDate}T00:00:00`
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </h2>

            {selectedData.words.length === 0 &&
            selectedData.memory.length === 0 ? (
              <div className="calendar-no-entry">
                <span>✦</span>
                <p>Nothing saved on this day yet.</p>
              </div>
            ) : (
              <div className="calendar-entries">
                {selectedData.words.map((item) => (
                  <article
                    className="calendar-entry"
                    key={item._id}
                  >
                    <BookOpen size={17} />

                    <div>
                      <small>{item.type}</small>
                      <h3>{item.title}</h3>
                      <p>{item.content}</p>
                    </div>
                  </article>
                ))}

                {selectedData.memory.map((item) => (
                  <article
                    className="calendar-entry"
                    key={item._id}
                  >
                    <Camera size={17} />

                    <div>
                      <small>MEMORY</small>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="calendar-bottom">
        <span>✦</span>

        <p>
          Every date is a little page
          <br />
          in the story of your days.
        </p>

        <span>✦</span>
      </footer>
    </main>
  );
}

export default Calendar;