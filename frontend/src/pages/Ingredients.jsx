import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Input,
  Collapse,
} from "reactstrap";
import API_URL from "../config";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
const Ingredients = () => {
  const { user } = useContext(UserContext);
  const [userIngredients, setUserIngredients] = useState([]);
  const [userId, setUserId] = useState(null);
  const [openCategories, setOpenCategories] = useState([]);
  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchIngredients();
    }
  }, [userId]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "sebze":
        return "#006400";
      case "şarküteri":
        return "#8B0000";
      case "yağ":
        return "#8B8B00";
      case "bakliyat":
        return "#4B0082";
      case "süt ürünleri":
        return "#000080";
      case "meyve":
        return "#8B008B";
      case "kahvaltılık":
        return "#008B8B";
      case "temel gıda":
        return "#8B4513";
      case "sos":
        return "#800080";
      case "baharat":
        return "#0067dd";
      case "unlu mamül":
        return "#2F4F4F";
      case "dondurulmuş ürünler":
        return "#191140";
      default:
        return "gray";
    }
  };
  const toggleCategory = (category) => {
    setOpenCategories((prevOpenCategories) => {
      if (prevOpenCategories.includes(category)) {
        return prevOpenCategories.filter((cat) => cat !== category);
      } else {
        return [...prevOpenCategories, category];
      }
    });
  };
  const fetchIngredients = async () => {
    try {
      const userIngredientsResponse = await fetch(
        `${API_URL}/user/get/ingredients/${userId}`
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

  const handleCheckboxChange = async (ingredientId, isChecked) => {
    try {
      const updatedIngredients = userIngredients.map((ingredient) => {
        if (ingredient._id === ingredientId) {
          return {
            ...ingredient,
            isAvailable: isChecked,
          };
        }
        return ingredient;
      });

      setUserIngredients(updatedIngredients);

      const response = await fetch(`${API_URL}/ingredients/set/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          updatedIngredients: updatedIngredients,
        }),
      });

      if (response.ok) {
        console.log("User ingredients updated successfully.");
      } else {
        console.error("Failed to update user ingredients.");
      }
    } catch (error) {
      console.error("Failed to update user ingredients.", error);
    }
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

  const groupedIngredients = groupIngredientsByCategory(userIngredients);

  return (
    <Container id="page">
      <h2 className="text-center mt-4">Malzeme Listesi</h2>
      {userIngredients.length === 0 ? (
        <p className="text-center">Malzeme Bulunamadı!</p>
      ) : (
        Object.entries(groupedIngredients).map(([category, ingredients]) => (
          <div key={category} className="mt-4">
            <h3
              style={{ cursor: "pointer" }}
              onClick={() => toggleCategory(category)}
              className="border-bottom border-2 border-black d-flex align-items-center flex-row justify-content-between mx-1 p-1"
            >
              <span> {category}</span>
              {openCategories.includes(category) ? (
                <BiSolidUpArrow className="ms-2" />
              ) : (
                <BiSolidDownArrow className="ms-2" />
              )}
            </h3>
            <Collapse isOpen={openCategories.includes(category)}>
              <Row>
                {ingredients.map((ingredient) => (
                  <Col sm="4" md="2" key={ingredient._id}>
                    <Card
                      className={`mb-4 d-flex flex-row text-white fs-6`}
                      style={{
                        backgroundColor: getCategoryColor(
                          category.toLowerCase()
                        ),
                      }}
                      onClick={() =>
                        handleCheckboxChange(
                          ingredient._id,
                          !ingredient.isAvailable
                        )
                      }
                    >
                      <CardBody className="d-flex flex-row justify-content-between align-items-center w-50">
                        <CardText className="my-0 py-0 pe-1">
                          {ingredient.name}
                        </CardText>
                        <Input
                          type="checkbox"
                          id={ingredient._id}
                          checked={ingredient.isAvailable}
                          onChange={(e) =>
                            handleCheckboxChange(
                              ingredient._id,
                              e.target.checked
                            )
                          }
                          label=""
                        />
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Collapse>
          </div>
        ))
      )}
    </Container>
  );
};

export default Ingredients;
