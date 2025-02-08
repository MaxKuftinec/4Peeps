import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/NavBar.css";

const NavBar = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <img src={logo} alt="UI Validator" className="logo" />
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </div>
            <button onClick={toggleTheme} className="theme-toggle">
                {theme === "light" ? "🌙" : "☀️"}
            </button>
        </nav>
    );
};

export default NavBar;