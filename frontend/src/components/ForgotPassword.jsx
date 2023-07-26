import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import API_URL from "../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ size: 6, offset: 3 }} className="mt-5">
          {message && <div className="alert alert-info">{message}</div>}
          <Form onSubmit={handleResetPassword}>
            <FormGroup>
              <Label for="email">E-posta</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
              />
            </FormGroup>
            <Button type="submit" color="primary" block>
              Şifre Sıfırlama Linkini Gönder
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
