<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/DashBoard";
import About from "./pages/About";
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

=======
import React from "react";
import Dashboard from "./pages/DashBoard";

function App() {
  return <Dashboard />;
}

>>>>>>> 59aaa37 (Test)
export default App;