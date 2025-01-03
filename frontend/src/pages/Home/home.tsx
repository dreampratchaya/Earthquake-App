import React from "react";
import { Link } from "react-router-dom";
import { CssBaseline, Button } from "@mui/material";
import "./home.css";

const Home: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <div className="Home">
        <div className="HomeCenter">
          <nav className="HomeNav">
            <Link to="/" className="HomeLink active">
              Home{" "}
            </Link>
            <Link to="/live" className="HomeLink">
              Live map{" "}
            </Link>
            <a href="/about" className="HomeLink">
              About
            </a>
          </nav>
          <h2 style={{ fontSize: "4em" }}>Real-Time Earthquake Monitoring</h2>
          <p className="EqDes">
            Stay informed with our live earthquake map. Track seismic activity
            worldwide and access critical data instantly.
          </p>
          <Button
            variant="outlined"
            sx={{
              width: 250,
              height: 70,
              fontSize: 20,
              borderWidth: 3,
              borderColor: "rgb(249, 128, 11, 0.6)",
              color: "rgb(249, 128, 11, 0.8)",
              "&:hover": {
                borderColor: "rgb(249, 128, 11, 1)",
                backgroundColor: "rgb(249, 128, 11, 0.1)",
                filter: "drop-shadow(0 0 40px rgb(249, 128, 11, 0.5))",
              },
            }}
            className="HomeButton"
            component={Link}
            to="/live"
          >
            Live Map
          </Button>
          <footer className="HomeFooter">
            <p>&copy; 66130423 Pratchaya Ponggun</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;
