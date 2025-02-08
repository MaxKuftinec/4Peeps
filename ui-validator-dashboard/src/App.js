import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/DashBoard";
import About from "./pages/About";
import Test from "./pages/Test";
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
				<Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;