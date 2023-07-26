import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiTwotoneLike,
  AiTwotoneDislike,
  AiTwotoneHeart,
} from "react-icons/ai";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import AnimatedText from "../components/AnimatedText";
import API_URL from "../config";
function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/get`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        throw new Error("Failed to fetch recipes.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container id="page">
      {recipes.length === 0 ? (
        <AnimatedText text="HENÜZ BİR YEMEK YOK" />
      ) : (
        <Row className="recipe-list mt-3">
          {recipes.map((recipe) => (
            <Col key={recipe._id} md={3} className="mb-4">
              <Card className="border border-black rounded border-1">
                <CardImg
                  top
                  src={recipe.image}
                  alt="Ingredient"
                  style={{
                    height: "200px",
                    width: "auto",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <CardBody style={{ backgroundColor: "#F5F5F5" }}>
                  <CardTitle tag="h5">{recipe.name}</CardTitle>
                  <CardSubtitle>Kategori:{recipe.category}</CardSubtitle>
                  <CardSubtitle>Şef:{recipe.author}</CardSubtitle>
                  <div className="my-3  d-flex flex-row align-items-center justify-content-evenly">
                    <div className="border-1 border-black border d-flex flex-row justifiy-content-evenly align-items-center  rounded p-2 ">
                      <AiTwotoneLike color="green" />
                      <p className="m-0 ms-1">{recipe.likes.length}</p>
                    </div>
                    <div className="border-1 border-black border d-flex flex-row justifiy-content-evenly align-items-center  rounded p-2 ">
                      <AiTwotoneDislike color="red" />
                      <p className="m-0 ms-1">{recipe.dislikes.length}</p>
                    </div>
                    <div className="border-1 border-black border d-flex flex-row justifiy-content-evenly align-items-center  rounded p-2 ">
                      <AiTwotoneHeart color="purple" />
                      <p className="m-0 ms-1">{recipe.favorites.length}</p>
                    </div>
                  </div>
                  <Row>
                    <Link
                      to={`/tarif/${recipe._id}`}
                      className="btn btn-primary w-100"
                    >
                      Detayları Gör
                    </Link>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Recipes;
