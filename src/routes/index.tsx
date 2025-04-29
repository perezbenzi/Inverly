import { Routes, Route } from "react-router-dom"
import { PrivateRoute } from "@/components/auth/PrivateRoute"
import Index from "@/pages/Index"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { Settings } from "@/pages/Settings"
import NotFound from "@/pages/NotFound"
import Scenarios from "@/pages/Scenarios"

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Index />
        </PrivateRoute>
      }
    />
    <Route
      path="/scenarios"
      element={
        <PrivateRoute>
          <Scenarios />
        </PrivateRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
) 