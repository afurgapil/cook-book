import { useState, useEffect } from "react";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

import API_URL from "../config";
const ManageUsers = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [newRecipe, setNewRecipe] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetchRecipes();
  }, []);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const handleEditClick = (id) => {
    setEditingRecipeId(id);
    const updatedRecipe = recipes.find((r) => r._id === id);
    setNewRecipe(updatedRecipe.howKnow);
    toggleModal();
  };
  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/get`);
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${API_URL}/recipe/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        fetchRecipes();
        toast.success("Yemek Silindi!", {
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
        console.error("Failed to delete recipe.");
      }
    } catch (error) {
      console.error("Error while deleting recipe:", error);
    }
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`${API_URL}/recipe/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          howKnow: newRecipe,
        }),
      });
      const data = await response.json();
      console.log("Updated Recipe:", data);
      setEditingRecipeId(null);
      fetchRecipes();
      toggleModal();
      toast.success("Yemek Güncellendi!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error updating Recipe:", error);
    }
  };
  return (
    <Container id="page">
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
      <div className="row mt-5">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="col-md-4 mt-3">
            <ListGroup>
              <ListGroupItem>
                <>
                  <h2 className="font-weight-bold mb-2">{recipe.name}</h2>
                  <ListGroupItemText>
                    Kategori: {recipe.category}
                  </ListGroupItemText>
                  <ListGroupItemText>Yazar: {recipe.author}</ListGroupItemText>
                  <div
                    style={{ overflow: "hidden", transition: "height 0.3s" }}
                  >
                    <p className="mb-3">{recipe.article}</p>
                  </div>
                  <Button
                    color="primary"
                    className="me-3 mt-2"
                    onClick={() => handleEditClick(recipe._id)}
                  >
                    Tarif Ekle
                  </Button>
                  <Button
                    color="danger"
                    className="mt-2"
                    onClick={() => deleteRecipe(recipe._id)}
                  >
                    Sil
                  </Button>
                </>
              </ListGroupItem>
            </ListGroup>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Tarif Ekle</ModalHeader>
        <ModalBody>
          <textarea
            className="form-control mb-2"
            value={newRecipe}
            onChange={(e) => setNewRecipe(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => handleSaveClick(editingRecipeId)}
          >
            Kaydet
          </Button>
          <Button color="danger" onClick={toggleModal}>
            İptal
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
