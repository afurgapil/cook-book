import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Container,
  CardSubtitle,
  Badge,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import { AiTwotoneHeart, AiFillStar } from "react-icons/ai";
import API_URL from "../config";
function Foods() {
  const { user } = useContext(UserContext);
  const [userIngredients, setUserIngredients] = useState([]);
  const [userIngLength, setUserIngLength] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [mappedRecipes, setmappedRecipes] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [spinners, setSpinners] = useState([true, true, true]);
  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchIngredients();
    }
    fetchRecipes();
  }, [userId]);
  useEffect(() => {
    if (userIngredients) {
      const availableIngredients = userIngredients.filter(
        (ingredient) => ingredient.isAvailable === true
      );
      setUserIngLength(availableIngredients.length);
      setSpinners((prevSpinners) => ({ ...prevSpinners, 1: false }));
    }
    fetchRecipes();
  }, [userIngredients]);
  useEffect(() => {
    if (allRecipes) {
      calculateStar();
    }
  }, [allRecipes]);
  const fetchIngredients = async () => {
    try {
      const userIngredientsResponse = await fetch(
        `${API_URL}/user/get/ingredients/${userId}`
      );

      if (userIngredientsResponse.ok) {
        const userIngredientsData = await userIngredientsResponse.json();
        setUserIngredients(userIngredientsData);
        setSpinners((prevSpinners) => ({ ...prevSpinners, 0: false }));
      } else {
        console.error("Failed to fetch user's ingredients.");
      }
    } catch (error) {
      console.error("Failed to fetch ingredients.", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/get`);
      if (response.ok) {
        const data = await response.json();
        setAllRecipes(data);
        setSpinners((prevSpinners) => ({ ...prevSpinners, 2: false }));
      } else {
        throw new Error("Failed to fetch recipes.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const calculateStar = () => {
    const updatedRecipes = matchedRecipes.map((recipe) => {
      const likesCount = recipe.likes.length;
      const dislikesCount = recipe.dislikes.length;
      const totalFeedback = likesCount + dislikesCount;

      const starRating = (likesCount / totalFeedback) * 10;
      const formattedRating = isNaN(starRating) ? 0 : starRating.toPrecision(2);

      return { ...recipe, starRating: formattedRating };
    });
    setmappedRecipes(updatedRecipes);
  };

  useEffect(() => {
    if (userIngredients.length > 0 && allRecipes.length > 0) {
      const matched = allRecipes.filter((recipe) =>
        recipe.ingredients.every((recipeIngredient) =>
          userIngredients.some(
            (userIngredient) =>
              userIngredient.name === recipeIngredient.name &&
              userIngredient.isAvailable
          )
        )
      );
      setMatchedRecipes(matched);
    } else {
      setMatchedRecipes([]);
    }
  }, [userIngredients, allRecipes]);

  return (
    <Container id="page">
      <Container>
        <Row className=" mt-4 text-center border-bottom border-1 border-black w-100">
          <Col>
            <h2>Malzeme Sayınız</h2>
            {spinners[0] ? (
              <Spinner></Spinner>
            ) : userIngredients.length === 0 ? (
              <p>Hiç malzemeniz yok!</p>
            ) : (
              <h3>{userIngLength}</h3>
            )}
          </Col>

          <Col className="border-start border-end border-1 border-black mb-4">
            {!spinners[1] && (
              <>
                <h2>Hazırlayabileceğiniz Yemek Sayısı</h2>
                <h3>{matchedRecipes.length}</h3>
              </>
            )}
          </Col>
          <Col>
            {!spinners[2] && (
              <>
                <h2>Toplam Yemek Sayısı</h2>
                <h3>{allRecipes.length}</h3>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <h2 className="text-center mt-3">MEVCUT ÖNERİLER</h2>
      {allRecipes.length === 0 ? (
        <p className="text-center">Sistemde yemek bulunmamakta.</p>
      ) : matchedRecipes.length === 0 ? (
        <p className="text-center">
          Elinizdeki malzemeler ile hazırlayabileceğiniz uygun yemekler arasında
          henüz eşleşme bulunmamaktadır.
        </p>
      ) : (
        <Row className="mx-auto">
          {mappedRecipes.map((recipe) => (
            <Col key={recipe._id} md={3} className="mb-4">
              <Card className="border border-black rounded border-1">
                <CardImg
                  top
                  src={recipe.image}
                  alt="Ingredient"
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <CardBody style={{ backgroundColor: "#F5F5F5" }}>
                  <CardTitle tag="h5">{recipe.name}</CardTitle>
                  <CardSubtitle>Kategori: {recipe.category}</CardSubtitle>
                  <div className="my-3  d-flex flex-row align-items-center justify-content-evenly">
                    <div className=" d-flex flex-row justifiy-content-evenly align-items-center bg-success rounded p-2 ">
                      <AiFillStar color="yellow" />
                      <Badge color="success">{recipe.starRating}</Badge>
                    </div>
                    <div className=" d-flex flex-row justifiy-content-evenly align-items-center bg-info rounded p-2 ">
                      <AiTwotoneHeart color="red" />
                      <Badge color="info">{recipe.favorites.length}</Badge>
                    </div>
                  </div>
                  <Row>
                    <Link
                      to={`/tarif/${recipe._id}`}
                      className="btn btn-primary w-100"
                    >
                      Detayları Görüntüle
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

export default Foods;
