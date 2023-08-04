import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

import API_URL from "../config.jsx";
function EditIngredient() {
  const [ingredients, setIngredients] = useState([]);
  const [sortedIngredients, setSortedIngredients] = useState([]);
  const [editingIngredientId, setEditingIngredientId] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  useEffect(() => {
    fetchIngredients();
    const value = ingredients
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    setSortedIngredients(value);
  }, [ingredients]);
  const updateIngredients = async () => {
    try {
      const response = await fetch(`${API_URL}/ingredients/get`);
      if (response.ok) {
        const fetchedData = await response.json();

        const responsee = await fetch(`${API_URL}/user/update/ingredients`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients: fetchedData }),
        });

        if (!responsee.ok) {
          throw new Error("Network response was not ok");
        }

        const updatedData = await responsee.json();
        console.log(updatedData);
      } else {
        throw new Error("Failed to fetch ingredients.");
      }
    } catch (error) {
      console.error("Error updating ingredient list:", error.message);
    }
  };
  const saveDelete = async (id) => {
    await handleDeleteClick(id);
    await updateIngredients();
  };
  const saveEdit = async (id) => {
    await handleSaveClick(id);
    await updateIngredients();
  };
  const fetchIngredients = async () => {
    try {
      const userIngredientsResponse = await fetch(`${API_URL}/ingredients/get`);

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
  const handleEditClick = (id) => {
    setEditingIngredientId(id);
    const updatedIngredient = ingredients.find(
      (ingredient) => ingredient._id === id
    );
    setUpdatedName(updatedIngredient.name);
    setUpdatedCategory(updatedIngredient.category);
  };
  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${API_URL}/ingredients/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data.message);
      toast.success("Malzeme Silindi!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchIngredients();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`${API_URL}/ingredients/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedName,
          category: updatedCategory,
        }),
      });
      const data = await response.json();
      console.log("Updated Article:", data);
      setEditingIngredientId(null);
      toast.success("Malzeme Güncellendi!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchIngredients();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  return (
    <Container id="page" className="my-5">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Row>
        {sortedIngredients.map((ingredient) => (
          <Col key={ingredient._id} xs={12} md={6}>
            {editingIngredientId === ingredient._id ? (
              <>
                <textarea
                  className="bg-danger-subtle form-control mb-2"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <textarea
                  className="bg-danger-subtle form-control mb-2"
                  value={updatedCategory}
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                />
                <Button
                  color="primary"
                  className="me-3"
                  onClick={() => saveEdit(ingredient._id)}
                >
                  Kaydet
                </Button>
                <Button
                  color="danger"
                  onClick={() => setEditingIngredientId(null)}
                >
                  İptal
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-weight-bold mb-2 mt-3">
                  {ingredient.name}
                </h2>
                <div style={{ overflow: "hidden", transition: "height 0.3s" }}>
                  <p className="mb-3">{ingredient.article}</p>
                </div>
                <Button
                  color="primary"
                  className="me-3 mt-2"
                  onClick={() => handleEditClick(ingredient._id)}
                >
                  Düzenle
                </Button>
                <Button
                  color="danger"
                  className="mt-2"
                  onClick={() => saveDelete(ingredient._id)}
                >
                  Sil
                </Button>
              </>
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EditIngredient;
