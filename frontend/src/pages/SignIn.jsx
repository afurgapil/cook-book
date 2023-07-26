import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Col,
  Container,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import ForgotPassword from "../components/ForgotPassword";
const Signin = () => {
  const { signin } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const toggleForgotPasswordModal = () => {
    setShowForgotPasswordModal(!showForgotPasswordModal);
  };
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signin(username, password);
      navigate("/");
    } catch (error) {
      switch (error.message) {
        case "Invalid password":
          setErrorMessage("Kullanıcı Adı - Şifre Kombinasyonu Uyuşmuyor!");
          break;
        case "User not found":
          setErrorMessage("Kullanıcı bulunamadı!");
          break;
        default:
          console.log("undefined error", error);
          break;
      }
    }
  };
  return (
    <Container style={{ maxHeight: "100vh" }} id="page">
      <div className="d-flex flex-row justify-content-around align-items-start">
        <Col
          md="12"
          className="m-5 p-5"
          style={{ boxShadow: "0px 4px 13px 11px rgba(124, 128, 116, 0.7)" }}
        >
          <div className="signin-form">
            <h2>Giriş Yap</h2>
            <Form onSubmit={handleSignin}>
              <FormGroup>
                <Label for="username">Kullanıcı Adı:</Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı Adınız"
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Şifre:</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreniz"
                />
              </FormGroup>
              <Button type="submit" color="primary" className="btn-signin">
                Giriş
              </Button>
            </Form>
            <div className="mt-2">
              {errorMessage && (
                <Badge className="text-white fs-4 bg-danger ">
                  {errorMessage}
                </Badge>
              )}
              <h5 className="fw-light">
                Hesabınız yok mu?{" "}
                <Link to="/kayit" className="btn btn-success">
                  Hesap Oluştur
                </Link>
              </h5>
              <h5 className="fw-light">
                Şifrenizi mi unuttunuz?
                <button
                  className="inline btn btn-danger"
                  onClick={toggleForgotPasswordModal}
                >
                  Şifre Sıfırla
                </button>
              </h5>
            </div>
          </div>
        </Col>
      </div>
      <Modal
        isOpen={showForgotPasswordModal}
        toggle={toggleForgotPasswordModal}
      >
        <ModalHeader toggle={toggleForgotPasswordModal}>
          Şifre Sıfırlama
        </ModalHeader>
        <ModalBody>
          <ForgotPassword />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleForgotPasswordModal}>
            Kapat
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Signin;
