import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setIsAuth(true);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Container id="page" className="my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2>İçerikleri görüntülemek için lütfen giriş yapınız.</h2>
          </Col>
        </Row>
        <Row className="text-center mb-4">
          <Col>
            <Link className="btn btn-primary" to="/giris">
              Giriş Yap
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }

  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/giris" />;
  }
}

export default PrivateRoute;
