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
import { useNavigate } from "react-router-dom";
const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const getTokenFromLocation = () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return params.get("token");
  };

  const handleResetPassword = async () => {
    event.preventDefault();
    const token = getTokenFromLocation();
    try {
      const response = await fetch(`${API_URL}/user/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (
        data.message ===
        "Şifreniz başarıyla sıfırlandı.Giriş sayfasına yönlendiriliyorsunuz"
      ) {
        setTimeout(() => {
          navigate("/giris");
        }, 4000);
      }
    } catch (err) {
      setMessage("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <Container id="page">
      <Row>
        <Col md={{ size: 6, offset: 3 }} className="mt-5">
          <h2 className="text-center">Şifre Sıfırlama</h2>
          {message && <div className="alert alert-info">{message}</div>}
          <Form onSubmit={handleResetPassword}>
            <FormGroup>
              <Label for="newPassword">Yeni Şifre</Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormGroup>
            <Button type="submit" color="primary" block>
              Şifreyi Sıfırla
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordPage;
