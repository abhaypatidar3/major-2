import { FaFacebookSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="f-social-info">
          <FaFacebookSquare />
          <FaInstagramSquare />
          <FaLinkedin />
        </div>
        <div className="f-tag">&copy; Syncora Private Limited</div>
        <div className="f-info-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
