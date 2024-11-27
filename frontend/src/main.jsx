import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    <Toaster />
  </StrictMode>
);
