import "./NotFound.css";
import { CssBaseline } from "@mui/material";
import { Link } from "react-router-dom";
import earthquakeIcon from "../../assets/earthquake.svg";
export default function NotFound() {
  return (
    <>
      <CssBaseline />
      <div className="NotFound">
        <nav className="HomeNav">
          <img src={earthquakeIcon} alt="" />
          <h4>Earthquake</h4>
          <Link to="/" className="HomeLink">
            Home{" "}
          </Link>
          <Link to="/live" className="HomeLink">
            Live map{" "}
          </Link>
        </nav>
        <div className="NotFoundCenter">
          <h1>404 NOT FOUND!</h1>
        </div>
      </div>
    </>
  );
}
