import {
  Routes,
  Route,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import SearchDashboard from "./pages/SearchDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import InspectorDashboard from "./pages/InspectorDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (

  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >

    <Header />

    <main
      style={{
        flex: 1,
      }}
    >

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/search-product"
          element={<SearchDashboard />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer"
          element={
            <ProtectedRoute role="FARMER">
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inspector"
          element={
            <ProtectedRoute role="INSPECTOR">
              <InspectorDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </main>

    <Footer />

  </div>

);
}