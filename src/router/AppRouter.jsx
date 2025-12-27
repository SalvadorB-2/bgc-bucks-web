import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../router/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import StudentDetails from "../pages/StudentDetails";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route path="/studens/:studentId" element={<StudentDetails />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
