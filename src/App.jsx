import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/login.css";
import HomePage from "./components/HomePage";
import Gallery from "./components/Gallery.jsx";
import CameraInfo from "./components/CameraInfo.jsx";
import NotWhitelisted from "./components/NotWhitelisted.jsx";
import LiveStreamPage from "./components/LiveStreamPage.jsx";
import RegisterPerson from "./components/RegisterPerson";

function App() {
  const [message, setMessage] = useState("");

  return (
    <div className="App">
      <Routes>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/Registerperson" element={<RegisterPerson />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/NotWhitelisted" element={<NotWhitelisted />} />
        <Route path="/CameraInfo" element={<CameraInfo />} />
        <Route path="/multistream" element={<div>Multistream Page</div>} />
        <Route path="/LiveStreamPage" element={<LiveStreamPage />} />
        <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect to dashboard for unknown routes */}
      </Routes>
    </div>
  );
}

export default App;