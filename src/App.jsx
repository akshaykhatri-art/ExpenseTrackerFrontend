import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import SlidingLoginSignup from "./pages/SlindingLoginSignup";
import CategoryList from "./pages/CategoryList";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";
import NotFound from "./pages/NotFound";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/auth"} />}
      />
      <Route path="/auth" element={<SlidingLoginSignup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/category"
        element={
          <ProtectedRoute>
            <CategoryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/category/add"
        element={
          <ProtectedRoute>
            <AddCategory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/category/edit/:id"
        element={
          <ProtectedRoute>
            <EditCategory />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
