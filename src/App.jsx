import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRout";
import FavoritesPage from "./pages/Favorites";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const mode = useSelector((state) => state.theme?.mode || "light");

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
