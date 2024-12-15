import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import AdminUserPage from "./pages/AdminUserPage";
import HomePage from "./pages/HomePage";
import FavoritePage from "./pages/FavoritePage";
import LoginPage from "./pages/LoginPage";
import SingleLocationPage from "./pages/SingleLocationPage";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Wrapper Component for Dynamic Styling
const AppContainer = ({ children }) => {
  const { theme } = useTheme(); // Access the current theme (light or dark)
  const backgroundColor = theme === "dark" ? "#121212" : "#F5F5F5"; // Dark or light background

  return (
    <div
      className="App"
      style={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        backgroundColor: backgroundColor, // Dynamic background color
        color: theme === "dark" ? "#FFFFFF" : "#000000", // Adjust text color
      }}
    >
      {children}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContainer>
          {/* Navbar */}
          <Navbar />

          {/* Toast Notifications */}
          <ToastContainer />

          {/* Routes */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin-user" element={<AdminUserPage />} />
            <Route path="/favorite" element={<FavoritePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/locations/:id" element={<SingleLocationPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;