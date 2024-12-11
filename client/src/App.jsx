import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritePage";
import LoginPage from "./pages/LoginPage";
import SingleLocationPage from "./pages/SingleLocationPage";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <ToastContainer position="bottom-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/favorites" element={<FavoritePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/locations/:id" element={<SingleLocationPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
