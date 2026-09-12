import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Landing from "./Landing";
import Home from "./Home";
import Write from "./Write";
import Alfaaz from "./Alfaaz";
import ReadAlfaaz from "./ReadAlfaaz";
import Memories from "./Memories";
import Favorites from "./Favorites";
import LateNight from "./LateNight";
import Calendar from "./Calendar";
import Collections from "./Collections";
import GaneshSpace from "./PrivateSpace";
import PrivateWrite from "./PrivateWrite";
import Profile from "./Profile";
import Password from "./Password";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function App() {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("alfaaz_token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("alfaaz_token");
      setAuthenticated(false);
      return;
    }

    setAuthenticated(true);
  }, [location.pathname]);

  if (!authenticated) return <Password />;

  if (location.pathname === "/") return <Landing />;
  if (location.pathname === "/home") return <Home />;
  if (location.pathname === "/write") return <Write />;
  if (location.pathname === "/alfaaz") return <Alfaaz />;
  if (location.pathname === "/read") return <ReadAlfaaz />;
  if (location.pathname === "/memories") return <Memories />;
  if (location.pathname === "/favorites") return <Favorites />;
  if (location.pathname === "/late-night") return <LateNight />;
  if (location.pathname === "/calendar") return <Calendar />;
  if (location.pathname === "/collections") return <Collections />;
  if (location.pathname === "/profile") return <Profile />;
  if (location.pathname === "/private/write") return <PrivateWrite />;
  if (location.pathname === "/private") return <GaneshSpace />;

  return <Home />;
}

export default App;