import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  Button,
  CardSubtitle,
} from "reactstrap";
import { IoIosHeartDislike } from "react-icons/io";
import { ImNewTab } from "react-icons/im";
import { Link } from "react-router-dom";
import AnimatedText from "../components/AnimatedText";
import API_URL from "../config";
const Favorites = () => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/favorites/${user?._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorites.");
      }
      const favoritesData = await response.json();
      setFavorites(favoritesData);

      const updatedFavoriteRecipes = [];

      for (let index = 0; index < favoritesData.length; index++) {
        const favorite = favoritesData[index];
        const recipeResponse = await fetch(`${API_URL}/recipe/get/${favorite}`);

        if (!recipeResponse.ok) {
          throw new Error("Failed to fetch recipe.");
        }

        const recipeData = await recipeResponse.json();
        updatedFavoriteRecipes.push(recipeData);
      }

      setFavoriteRecipes(updatedFavoriteRecipes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfavorite = async (recipeId) => {
    try {
      const response = await fetch(`${API_URL}/recipe/unfavorite/${recipeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (response.ok) {
        fetchFavorites();
        console.log("Successfully removed from favorites.");
      } else {
        console.error("Failed to remove from favorites.");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  if (favorites.length === 0) {
    return (
      <Container id="page">
        <AnimatedText text={"HENÜZ BİR FAVORİ YOK"}></AnimatedText>
      </Container>
    );
  }
  return (
    <Container id="page">
      <Row className="recipe-list mt-5">
        {favoriteRecipes.map((recipe) => (
          <Col key={recipe._id} className="mb-4">
            <Row>
              <Col xs="12" sm="6" md="4">
                <Card>
                  <CardImg top src={recipe.image} alt="Ingredient" />
                  <CardBody style={{ backgroundColor: "#F5F5F5" }}>
                    <CardTitle tag="h5">{recipe.name}</CardTitle>
                    <div className="d-flex flex-row justify-content-center align-items-center">
                      <Button
                        onClick={() => {
                          handleUnfavorite(recipe._id);
                        }}
                        className="btn btn-danger m-2"
                      >
                        <IoIosHeartDislike color="white" />
                      </Button>
                      <Link
                        to={`/tarif/${recipe._id}`}
                        className="btn btn-primary m-2 "
                      >
                        <ImNewTab></ImNewTab>
                      </Link>
                    </div>
                    <CardSubtitle>
                      * Bu yemeğin {recipe.favorites.length} takipçisi var!
                    </CardSubtitle>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Favorites;
