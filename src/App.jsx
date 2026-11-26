
import { useEffect, useState } from "react";

import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import Schedule from "./pages/Schedule.jsx";
import Apply from "./pages/Apply.jsx";

function getCurrentPath() {
  const hash = window.location.hash;

  if (hash.startsWith("#/")) {
    return hash.slice(1).split("?")[0].replace(/\/+$/, "") || "/";
  }

  return "/";
}

export default function App() {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handleHashChange = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (path === "/main") {
    return <Main />;
  }

  if (path === "/exam/schedule") {
    return <Schedule />;
  }

  if (path === "/exam/apply") {
    return <Apply />;
  }

  return <Home />;
}
