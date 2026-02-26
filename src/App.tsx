import { Routes, Route, Navigate } from "react-router-dom"
import LoginMasyarakat from "./pages/LoginMasyarakat"
import RegisterMasyarakat from "./pages/RegisterMasyarakat"
import ForgotPassword from "./pages/ForgotPassword"
import AdminDashboard from "./pages/AdminDashboard"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginMasyarakat />} />
        <Route path="/register" element={<RegisterMasyarakat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App;