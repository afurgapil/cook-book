import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Button,
  CardImg,
  Container,
  Row,
  Col,
  ButtonGroup,
  Progress,
  ListGroupItemHeading,
} from "reactstrap";
import {
  AiOutlineFieldTime,
  AiFillTool,
  AiTwotoneLike,
  AiTwotoneDislike,
  AiTwotoneHeart,
} from "react-icons/ai";
import { UserContext } from "../context/UserContext";
import API_URL from "../config";
function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userID, setUserID] = useState(null);
  const { user } = useContext(UserContext);
  const [userIngredients, setUserIngredients] = useState([]);
  const [matchedIngredients, setMatchedIngredients] = useState("");
  const [arrayedRecipe, setArrayedRecipe] = useState([]);

  useEffect(() => {
    if (userID) {
      fetchIngredients();
    }
    fetchRecipe();
  }, [userID]);
  useEffect(() => {
    if (recipe) {
      splitHowKnow(recipe.howKnow);
    }
  }, [recipe]);
  useEffect(() => {
    if (user) {
      setUserID(user._id);
    }
  }, [user]);
  useEffect(() => {
    if (userIngredients.length > 0 && recipe) {
      const matched = recipe.ingredients.filter((recipeIngredient) =>
        userIngredients.some(
          (userIngredient) =>
            userIngredient.name === recipeIngredient.name &&
            userIngredient.isAvailable
        )
      );
      setMatchedIngredients(matched.length);
    } else {
      setMatchedIngredients(0);
    }
  }, [userIngredients, recipe]);

  const fetchIngredients = async () => {
    try {
      const userIngredientsResponse = await fetch(
        `${API_URL}/user/get/ingredients/${userID}`
      );

      if (userIngredientsResponse.ok) {
        const userIngredientsData = await userIngredientsResponse.json();
        setUserIngredients(userIngredientsData);
      } else {
        console.error("Failed to fetch user's ingredients.");
      }
    } catch (error) {
      console.error("Failed to fetch ingredients.", error);
    }
  };
  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/get/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
        setIsLiked(data.likes.includes(user?._id));
        setIsDisliked(data.dislikes.includes(user?._id));
        setIsFavorited(data.favorites.includes(user?._id));
      } else {
        throw new Error("Failed to fetch recipe.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/like/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userID }),
      });
      if (response.ok) {
        setIsLiked(true);
        setIsDisliked(false);
      } else {
        console.error("Failed to like the recipe.");
      }
    } catch (error) {
      console.error("Error liking the recipe:", error);
    }
  };
  const handleDislike = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/dislike/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userID }),
      });
      if (response.ok) {
        setIsLiked(false);
        setIsDisliked(true);
      } else {
        console.error("Failed to dislike the recipe.");
      }
    } catch (error) {
      console.error("Error disliking the recipe:", error);
    }
  };
  const handleFavorite = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/recipe/favorite/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userID }),
      });

      if (response.ok) {
        setIsFavorited(true);
      } else {
        console.error("Failed to favorite the recipe");
      }
    } catch (error) {
      console.error("Error favoriting the recipe:", error);
    }
  };
  const splitHowKnow = (text) => {
    const sentences = text.split(/[.!?]/).filter(Boolean);
    const cleanedSentences = sentences.map((sentence) => sentence.trim());
    setArrayedRecipe(cleanedSentences);
  };
  return (
    <div>
      {recipe ? (
        <div>
          <Container>
            <Row className="d-flex flex-row justify-content-center align-items-start my-5">
              <Col className="border-end border-black border-2">
                <Card
                  inverse
                  className="w-100 relative p-2 border border-black border-1 bg-secondary "
                >
                  <CardImg alt="Yemek Resmi" src={recipe.image} />
                  <CardTitle
                    tag="h2"
                    className="absolute w-100 bottom-0 top-0 p-3 bg-secondary text-white mb-0 d-flex flex-row justify-content-between align-items-center "
                  >
                    {recipe.name}
                    <h3 className="text-left fw-light fst-italic">
                      -{recipe.author}
                    </h3>
                  </CardTitle>
                </Card>
              </Col>
              <Col className="d-flex flex-column align-items-center justify-content-center">
                <div className="text-center w-100">
                  <h6 className="fs-6">Malzeme Durumunuz</h6>
                  <Progress
                    max={recipe.ingredients.length}
                    value={matchedIngredients}
                    animated
                    color="dark"
                    className="my-2 fs-2 bg-dark text-center "
                    style={{ height: "30px" }}
                  ></Progress>
                </div>
                <div className="bg-secondary text-white  w-100 d-flex flex-row justfiy-content-around align-items-center fs-6">
                  <Col className="d-flex flex-row align-items-center justify-content-center">
                    Kategori:{recipe.category}
                  </Col>
                  <Col className="d-flex flex-row align-items-center justify-content-center">
                    <AiOutlineFieldTime></AiOutlineFieldTime>
                    {recipe.time}
                  </Col>
                  <Col className="d-flex flex-row align-items-center justify-content-center">
                    <AiFillTool></AiFillTool>
                    {recipe.difficulty}/10
                  </Col>
                  <Col className="d-flex flex-row align-items-center justify-content-center">
                    <ButtonGroup>
                      <AiTwotoneLike></AiTwotoneLike>
                      {recipe.likes.length}
                      <AiTwotoneDislike className="mx-1"></AiTwotoneDislike>
                      {recipe.dislikes.length}
                      <AiTwotoneHeart></AiTwotoneHeart>
                      {recipe.favorites.length}
                    </ButtonGroup>
                  </Col>
                </div>
                <ListGroup className="w-100">
                  {recipe.ingredients.map((ingredient) => (
                    <ListGroupItem
                      style={{ backgroundColor: "var(--secondary-light)" }}
                      key={ingredient._id}
                      className="text-white"
                    >
                      {ingredient.name}
                    </ListGroupItem>
                  ))}
                </ListGroup>
                <div className="w-100 d-flex flex-row align-items-center justify-content-around">
                  <Button
                    color="primary"
                    className="cursor-pointer btn w-100 text-white"
                    onClick={handleLike}
                    disabled={isLiked}
                  >
                    <AiTwotoneLike />
                  </Button>
                  <Button
                    color="danger"
                    className="cursor-pointer btn w-100 text-white"
                    onClick={handleDislike}
                    disabled={isDisliked}
                  >
                    <AiTwotoneDislike />
                  </Button>
                  <Button
                    color="success"
                    className="cursor-pointer btn w-100 text-white"
                    onClick={handleFavorite}
                    disabled={isFavorited}
                  >
                    <AiTwotoneHeart />
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="my-5">
              <ListGroup>
                <ListGroupItemHeading className="fw-bolder fs-1 border-bottom border-black border-2">
                  TARİF
                </ListGroupItemHeading>
                {arrayedRecipe.map((step, index) => (
                  <ListGroupItem
                    key={index}
                    className="px-auto border-black ms-1"
                    style={{ background: "none" }}
                  >
                    {step}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Row>
          </Container>
        </div>
      ) : (
        <p>Tarif Yükleniyor.</p>
      )}
    </div>
  );
}

export default RecipeDetails;
