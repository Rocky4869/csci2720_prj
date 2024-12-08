import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritePage";
import LoginPage from "./pages/LoginPage";
import SingleLocationPage from "./pages/SingleLocationPage";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/location/:id" element={<SingleLocationPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
