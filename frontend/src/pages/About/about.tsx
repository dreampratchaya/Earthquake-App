import React from "react";
import { Link } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import "./about.css";

const About: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <div className="About">
        <div className="AboutCenter">
          <nav className="HomeNav">
            <Link to="/" className="HomeLink">
              Home{" "}
            </Link>
            <Link to="/live" className="HomeLink">
              Live map{" "}
            </Link>
            <Link to="/about" className="HomeLink active">
              About{" "}
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default About;
