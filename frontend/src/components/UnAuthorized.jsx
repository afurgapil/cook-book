import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const UnAuthorized = () => {
  return (
    <Container id="page" className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Access Denied</h2>
          <p>
            You don't have permission to access this page. Please sign in with
            an authorized account or contact an administrator.
          </p>
          <p className="mt-4">
            To return to the homepage, click
            <Link to="/" className="text-primary">
              here
            </Link>
            .
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default UnAuthorized;
