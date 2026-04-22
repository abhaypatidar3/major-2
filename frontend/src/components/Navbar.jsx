import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar navbar-expand-md sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img width="200px" src="/images/syncoracutout.png" alt="Syncora" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-link" to="/home">
              Home
            </Link>
            {/* <Link className="nav-link" to="/services">
              Services
            </Link> */}
            {/* <Link className="nav-link" to="/community">
              Community
            </Link> */}
            {isAuthenticated ? (
              <>
                <Link className="nav-link" to="/find-gynaecologists">
                  Find Gynaecologists
                </Link>

                {/* ADD THIS LINE */}
                <Link className="nav-link" to="/remedy">
                  Remedy Suggestions
                </Link>
                <Link className="nav-link" to="/cycle-tracker">
                  Cycle Tracker
                </Link>
                <Link className="nav-link" to="/risk-prediction">
                  Risk Prediction
                </Link>
                <Link className="nav-link" to="/services">
                  Services
                </Link>

                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
                <button className="nav-link btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
