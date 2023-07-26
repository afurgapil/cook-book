import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Card,
  Badge,
  Row,
  Col,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";
const Signup = () => {
  const { signup } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [photo, setPhoto] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchIngredients();
  }, []);
  useEffect(() => {
    fetch(`${API_URL}/random-photo`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0]) {
          setPhoto(data[0].urls.regular);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchIngredients = async () => {
    try {
      const userIngredientsResponse = await fetch(
        `${API_URL}/ingredients/get/`
      );

      if (userIngredientsResponse.ok) {
        const data = await userIngredientsResponse.json();
        setIngredients(data);
      } else {
        console.error("Failed to fetch  ingredients.");
      }
    } catch (error) {
      console.error("Failed to fetch ingredients.", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(username, password, name, surname, email, ingredients);
      navigate("/");
    } catch (error) {
      switch (error.message) {
        case "username is duplicated":
          setErrorMessage("Bu Kullanıcı Kullanımda.");
          break;
        case "email is duplicated":
          setErrorMessage("Bu Mail Adresi Kullanımda");
          setIsResetPassword(true);
          break;
        default:
          console.log("undefined error", error);
          break;
      }
    }
  };

  return (
    <Container id="page">
      <div className="d-flex flex-column flex-column-reverse flex-md-row align-items-center justify-content-center mt-5">
        <div className="col-md-6">
          {errorMessage ? (
            <div className="flex-1">
              <Badge className="text-white fs-4 bg-danger">
                {errorMessage}
              </Badge>
              {isResetPassword && <Link to="/">Şifremi sıfırla</Link>}
            </div>
          ) : (
            <Card className="mt-5 mt-md-0 m-md-3">
              <img
                alt="Sample"
                src={photo}
                style={{
                  maxHeight: "400px",
                  objectFit: "cover",
                  objectPosition: "left bottom",
                }}
              />
            </Card>
          )}
        </div>
        <div className="col-md-6 m-md-3">
          <Form onSubmit={handleSignup}>
            <FormGroup>
              <Label for="username">Kullanıcı Adı:</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Şifre:</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="name">Ad:</Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="surname">Soyad:</Label>
                  <Input
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="email">Mail:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <Button type="submit" color="primary">
              Üye Ol
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
