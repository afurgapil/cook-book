import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import exhaust from "../assets/exhaust.gif";
function NotFound() {
  return (
    <Container
      id="page"
      className="d-flex flex-column jusitfy-content-center align-items-center mt-5"
    >
      <div>
        <img src={exhaust} alt="exhaust gif" width="150px" />
      </div>
      <h3 className=" fw-bolder" style={{ fontSize: "5rem", color: "#33cccc" }}>
        404
      </h3>
      <h4 className="my-3">
        <span className="fw-bold" style={{ color: "#33cccc" }}>
          HAYY!!
        </span>
        Sayfa bulunamadı.
      </h4>
      <h5 className="text-center text-md-left">
        Aradığınız sayfa bulunamadı. Anasayfaya dönmek için
        <Link to="/"> tıklayınız</Link>
      </h5>
    </Container>
  );
}

export default NotFound;
