import { Container, Row, Col } from "reactstrap";

// eslint-disable-next-line react/prop-types
function AnimatedText({ text }) {
  return (
    <Container id="page">
      <Row>
        <Col>
          <svg className="svg">
            <text
              x="50%"
              y="50%"
              dy=".35em"
              textAnchor="middle"
              className="text"
            >
              {text}
            </text>
          </svg>
        </Col>
      </Row>
    </Container>
  );
}

export default AnimatedText;
