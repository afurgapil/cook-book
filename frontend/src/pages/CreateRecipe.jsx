import { useState, useEffect, useContext } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Collapse,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { UserContext } from "../context/UserContext";
import Resizer from "react-image-file-resizer";
import { ToastContainer, toast } from "react-toastify";

import API_URL from "../config";
const CreateRecipe = () => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [time, setTime] = useState("");
  const [howKnow, setHowKnow] = useState("");
  const [dbIngredients, setDbIngredients] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [author, setAuthor] = useState("");
  useEffect(() => {
    if (user) {
      const name = user.username;
      setAuthor(name);
    }
  }, [user]);
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${API_URL}/ingredients/get`);
      if (response.ok) {
        const data = await response.json();
        setDbIngredients(data);
      } else {
        throw new Error("Failed to fetch ingredients.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCategory = (category) => {
    setOpenCategory((prevOpenCategory) =>
      prevOpenCategory === category ? null : category
    );
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "name") {
      setName(value);
    } else if (name === "category") {
      setCategory(value);
    } else if (name === "difficulty") {
      setDifficulty(value);
    } else if (name === "time") {
      setTime(value);
    } else if (name === "howKnow") {
      setHowKnow(value);
    }
  };
  const handleIngredientCheckboxChange = (event, ingredient) => {
    const { checked } = event.target;

    if (checked) {
      setRecipeIngredients((prevIngredients) => [
        ...prevIngredients,
        ingredient,
      ]);
    } else {
      setRecipeIngredients((prevIngredients) =>
        prevIngredients.filter((item) => item._id !== ingredient._id)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/recipe/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          image,
          difficulty,
          time,
          howKnow,
          author,
          ingredients: recipeIngredients,
        }),
      });
      if (response.ok) {
        setName("");
        setCategory("");
        setImage("");
        setDifficulty("");
        setTime("");
        setHowKnow("");
        setRecipeIngredients([]);
        toast.success("Yemek Kaydedildi!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        throw new Error("Failed to create recipe.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const convertToBase64 = (e) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onload = () => {
  //     setImage(reader.result);
  //   };
  //   reader.onerror = (error) => {
  //     console.log(error);
  //   };
  // };
  const convertAndResizeToBase64 = (e) => {
    const file = e.target.files[0];
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      70,
      0,
      (uri) => {
        setImage(uri);
      },
      "base64"
    );
  };

  const groupIngredientsByCategory = (ingredients) => {
    const sortedIngredients = ingredients.slice().sort((a, b) => {
      const categoryComparison = a.category.localeCompare(b.category);

      if (categoryComparison === 0) {
        return a.name.localeCompare(b.name);
      }

      return categoryComparison;
    });

    return sortedIngredients.reduce((result, ingredient) => {
      const category = ingredient.category;
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(ingredient);
      return result;
    }, {});
  };

  const groupedIngredients = groupIngredientsByCategory(dbIngredients);
  return (
    <div className="d-flex  align-items-center justify-content-center">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container className="mt-3 mx-2 ">
        <Row className="d-flex flex-row align-items-start justify-content-start">
          <Col>
            {dbIngredients.length === 0 ? (
              <p>No ingredients found.</p>
            ) : (
              Object.entries(groupedIngredients).map(
                ([category, ingredients]) => (
                  <div key={category}>
                    <h3
                      onClick={() => toggleCategory(category)}
                      style={{ cursor: "pointer" }}
                      className="h4 pb-2 mb-4 text-black border-bottom border-danger"
                    >
                      {category}
                    </h3>
                    <Collapse isOpen={openCategory === category}>
                      <ListGroup>
                        {ingredients.map((ingredient) => (
                          <ListGroupItem
                            key={ingredient._id}
                            className="bg-gray"
                          >
                            <Label
                              check
                              className="d-flex flex-row justify-content-between "
                            >
                              {ingredient.name}

                              <Input
                                type="checkbox"
                                checked={recipeIngredients.includes(ingredient)}
                                onChange={(event) =>
                                  handleIngredientCheckboxChange(
                                    event,
                                    ingredient
                                  )
                                }
                                className="p-1 border-black rounded"
                              />
                            </Label>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </Collapse>
                  </div>
                )
              )
            )}
          </Col>
          <Col>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">
                  <span className="text-danger">*</span>İsim:
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="category">
                  <span className="text-danger">*</span>Kategori:
                </Label>
                <Input
                  type="text"
                  id="category"
                  name="category"
                  value={category}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="difficulty">
                  <span className="text-danger">*</span>Zorluk:
                </Label>
                <Input
                  type="select"
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option disabled value="">
                    Zorluk Seviyesi Seçiniz
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="time">
                  <span className="text-danger">*</span>Süre:
                </Label>
                <Input
                  type="text"
                  id="time"
                  name="time"
                  value={time}
                  onChange={handleInputChange}
                  placeholder="Dakika cinsinden"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="howKnow">Tarif:</Label>
                <Input
                  type="text"
                  id="howKnow"
                  name="howKnow"
                  value={howKnow}
                  onChange={handleInputChange}
                  placeholder="Adımları belirtmek için cümle sonuna nokta koymayı unutmayınız."
                />
              </FormGroup>
              <FormGroup>
                <Label for="image">
                  <span className="text-danger">*</span>Resim:
                </Label>
                <div className="image-input">
                  <Input
                    id="image"
                    type="file"
                    accept="image/"
                    onChange={(e) => {
                      convertAndResizeToBase64(e);
                    }}
                    required
                  />
                </div>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row className="my-3">
          <Button
            className="btn btn-success btn-lg"
            type="submit"
            onClick={handleSubmit}
          >
            Add Recipe
          </Button>
        </Row>
      </Container>
    </div>
  );
};

export default CreateRecipe;
