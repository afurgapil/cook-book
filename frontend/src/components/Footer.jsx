import { Container } from "reactstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-black" id="footer">
      <Container className="d-flex flex-row justify-content-center align-items-center">
        <p className="text-center m-0 p-0">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <p className="text-center d-flex align-items-center m-0 p-0">
          <Link
            to="https://github.com/afurgapil"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-danger p-1"
          >
            Gapil
          </Link>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
