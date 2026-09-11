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

function App() {
  const location = useLocation();

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

  return <Landing />;
}

export default App;