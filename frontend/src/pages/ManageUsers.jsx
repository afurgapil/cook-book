import { useState, useEffect } from "react";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

import API_URL from "../config";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
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

  const handleAdminButtonClick = async (userId, value) => {
    try {
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
        toast.success("Üye Bilgisi Güncellendi!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchUsers();
      } else {
        console.error("Failed to set admin role.");
      }
    } catch (error) {
      console.error("Error setting admin role:", error);
    }
  };

  return (
    <Container
      id="page"
      className="d-flex align-items-start justify-content-center"
    >
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
      <div className="row mt-5 w-75">
        <div className="col ">
          <ListGroup>
            {users.map((user) => (
              <ListGroupItem
                key={user._id}
                className="d-flex flex-column flex-md-row"
              >
                <div className="col">
                  <ListGroupItemText>
                    Kullanıcı Adı:{user.username}
                  </ListGroupItemText>
                  <ListGroupItemText>Mail:{user.email}</ListGroupItemText>
                </div>
                <div className="row">
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
      </div>
    </Container>
  );
};

export default ManageUsers;
