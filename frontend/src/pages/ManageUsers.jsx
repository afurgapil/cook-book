import { useState, useEffect } from "react";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
} from "reactstrap";
import API_URL from "../config";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [dbIngredients, setDbIngredients] = useState([]);
  useEffect(() => {
    fetchUsers();
    fetchIngredients();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user/get`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
  const updateIngredients = async () => {
    try {
      const response = await fetch(`${API_URL}/user/update/ingredients`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: dbIngredients }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Başarı durumunda mesajı alabilirsiniz
    } catch (error) {
      console.error("Error updating ingredient list:", error.message);
    }
  };
  const handleAdminButtonClick = async (userId, value) => {
    try {
      console.log(value);
      const response = await fetch(
        `${API_URL}/user/update/isAdmin/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value }),
        }
      );

      if (response.ok) {
        console.log("User's isAdmin property updated successfully.");
        fetchUsers();
      } else {
        console.error("Failed to set admin role.");
      }
    } catch (error) {
      console.error("Error setting admin role:", error);
    }
  };

  return (
    <Container id="page">
      <div className="row mt-5">
        <div className="col">
          <ListGroup>
            {users.map((user) => (
              <ListGroupItem key={user._id} className="d-flex flex-row">
                <div className="col">
                  <ListGroupItemText>
                    Kullanıcı Adı:{user.username}
                  </ListGroupItemText>
                  <ListGroupItemText>Mail:{user.email}</ListGroupItemText>
                </div>
                <div className="col">
                  <Button
                    color="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAdminButtonClick(user._id, true)}
                    disabled={user.isAdmin}
                  >
                    Admin Yetkisi Ver
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAdminButtonClick(user._id, false)}
                    disabled={!user.isAdmin}
                  >
                    Admin Yetkisini Kaldır
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
        <div className="col d-flex justify-content-start align-items-center text-center">
          <button
            onClick={updateIngredients}
            className="btn btn-danger btn-lg my-auto"
          >
            Malzeme Listesini Güncelle
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ManageUsers;
