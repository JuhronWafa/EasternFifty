import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";

function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    setVisible(false);

    const timer = setTimeout(() => {
      setDisplayLocation(location);
      window.scrollTo(0, 0);
      setVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Navbar />
      <div
        className={`transition-opacity duration-200 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
