import "./NotFound.css";
import { CssBaseline } from "@mui/material";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <>
      <CssBaseline />
      <div className="NotFound">
        <nav className="HomeNav">
          <Link to="/" className="HomeLink">
            Home{" "}
          </Link>
          <Link to="/live" className="HomeLink">
            Live map{" "}
          </Link>
          <a href="/about" className="HomeLink">
            About
          </a>
        </nav>
        <div className="NotFoundCenter">
          <h1>404 NOT FOUND!</h1>
        </div>
      </div>
    </>
  );
}
