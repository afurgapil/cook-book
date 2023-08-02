import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import API_URL from "../config";
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import {
  MdCleaningServices,
  MdRoomService,
  MdComment,
  MdMenuBook,
} from "react-icons/md";
import Resizer from "react-image-file-resizer";

function PlaceDetail() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    author: "",
    itemName: "",
    price: "",
    rating: "",
    itemImage: "",
    comment: "",
  });
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentOnMenuModalOpen, setCommentOnMenuModalOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [author, setAuthor] = useState(null);
  useEffect(() => {
    if (user) {
      const name = user.username;
      setAuthor(name);
      setNewMenuItem((prevMenuItem) => ({
        ...prevMenuItem,
        author: name,
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchPlaceDetail();
  }, []);

  const fetchPlaceDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/place/get/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPlace(data);
      } else {
        throw new Error("Failed to fetch place detail.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenuModal = () => {
    setMenuModalOpen(!menuModalOpen);
  };
  const toggleCommentModal = () => {
    setCommentModalOpen(!commentModalOpen);
  };
  const toggleCommentOnMenuModal = () => {
    setCommentOnMenuModalOpen(!commentOnMenuModalOpen);
    console.log(commentOnMenuModalOpen);
  };
  const toggleImageModal = () => {
    setImageModalOpen(!isImageModalOpen);
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    toggleImageModal();
  };
  const handleNewMenuItemChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prevMenuItem) => ({
      ...prevMenuItem,
      [name]: value,
    }));
  };
  const handleNewCommentChange = (e) => {
    const { value } = e.target;
    setCommentValue(value);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/place/addMenuItem/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenuItem),
      });
      if (response.ok) {
        const data = await response.json();
        setPlace((prevPlace) => ({
          ...prevPlace,
          menu: [...prevPlace.menu, data],
        }));
        setNewMenuItem({
          ...newMenuItem,
          itemName: "",
          price: "",
          rating: "",
          itemImage: "",
          comment: "",
        });
        toggleMenuModal();
      } else {
        throw new Error("Failed to add menu item.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddCommentOnMenu = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_URL}/place/addCommentOnMenu/${id}/${selectedMenuItemId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ author: author, content: commentValue }),
        }
      );
      if (response.ok) {
        fetchPlaceDetail();
        setCommentValue(null);
        toggleCommentOnMenuModal();
      } else {
        throw new Error("Failed to add comment.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/place/addComment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: author, content: commentValue }),
      });
      if (response.ok) {
        fetchPlaceDetail();
        setCommentValue(null);
        toggleCommentModal();
      } else {
        throw new Error("Failed to add comment.");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setNewMenuItem((prevMenuItem) => ({
          ...prevMenuItem,
          itemImage: uri,
        }));
      },
      "base64"
    );
  };

  return (
    <Container id="page">
      {place ? (
        <div className="my-5">
          <div className="p-4 mb-4 rounded-lg bg-danger-subtle border border-1 border-black d-flex flex-row w-100 justify-content-between align-items-center">
            <div
              className="d-flex flex-column justify-content-start"
              style={{ width: "33%" }}
            >
              <h4 className="">{place.placeName}</h4>
              <h5 className="">
                {place.city}/{place.district}
              </h5>
            </div>
            <div className="d-flex flex-column flex-md-row align-self-end">
              <p className="m-0 px-1 fs-5">
                <MdCleaningServices />: {place.cleanliness}
              </p>
              <p className="m-0 px-1 fs-5">
                <MdRoomService />: {place.staffAttitude}
              </p>
              <p className="m-0 px-1 fs-5">
                <MdMenuBook />: {place.menu.length}
              </p>
              <p className="m-0 px-1 fs-5">
                <MdComment />: {place.comments.length}
              </p>
            </div>
          </div>
          <div className="w-100 d-flex justify-content-center justify-content-md-end  flex-row">
            <Button className="mx-2" color="primary" onClick={toggleMenuModal}>
              Ürün Ekle
            </Button>
            <Button
              className="mx-2"
              color="danger"
              onClick={() => {
                toggleCommentModal();
              }}
            >
              Yorum Ekle
            </Button>
          </div>
          <h3 className="fs-1">Menü</h3>
          {place.menu ? (
            <Row className="d-flex justify-content-center align-items-center">
              {place.menu.length > 0 ? (
                place.menu.map((menuItem) => (
                  <Row
                    key={menuItem._id}
                    className="bg-white ps-md-0 border border-1 border-black"
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center ps-0">
                      <img
                        className="col-2"
                        src={menuItem.itemImage}
                        style={{
                          width: "auto",
                          height: "300px",
                          maxWidth: "300px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        onClick={() => handleImageClick(menuItem.itemImage)}
                      ></img>
                      <div className="col-9 mt-2">
                        <div>
                          <div className="d-flex flex-row justify-content-between">
                            <div>
                              <h5>Ürün Adı: {menuItem.itemName}</h5>
                              <p>
                                <strong>Fiyat: </strong>
                                {menuItem.price} TL
                                <br />
                                <strong>Puan: </strong>
                                {menuItem.rating}
                              </p>
                            </div>

                            <Button
                              color="primary"
                              onClick={() => {
                                toggleCommentOnMenuModal();
                                setSelectedMenuItemId(menuItem._id);
                              }}
                            >
                              Yorum Ekle
                            </Button>
                          </div>

                          {menuItem.comments ? (
                            <ListGroup
                              className="overflow-y-scroll mt-2"
                              style={{ height: "90px" }}
                            >
                              {menuItem.comments.map((comment, key) => (
                                <ListGroupItem
                                  key={key}
                                  className="d-flex flex-row  justify-content-between align-items-center"
                                >
                                  <div>
                                    <strong>{comment.author}</strong>
                                    <p>{comment.content}</p>
                                  </div>

                                  <strong>{comment.createdAt}</strong>
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          ) : (
                            <p>Henüz yorum yapılmamış.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Row>
                ))
              ) : (
                <p>Menü bilgisi bulunamadı.</p>
              )}
            </Row>
          ) : (
            <p>Menü bilgisi bulunamadı.</p>
          )}
          <h3 className="fs-1 my-4">Yorumlar</h3>
          {place.comments.length > 0 ? (
            <Row>
              <ListGroup>
                {place.comments.map((comment, index) => (
                  <ListGroupItem key={index} className="bg-warning-subtle">
                    <strong className="ms-2 fs-5">{comment.author}: </strong>
                    <p className="ms-2 text-break">{comment.content}</p>
                    <p className="text-end mx-2">{comment.createdAt}</p>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Row>
          ) : (
            <p>Henüz yorum yapılmamış.</p>
          )}
          <Modal isOpen={isImageModalOpen} toggle={toggleImageModal} size="xl">
            <ModalBody className="text-center">
              <img
                src={selectedImage}
                alt="Tam Ekran Resim"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </ModalBody>
          </Modal>
          <Modal isOpen={menuModalOpen} toggle={toggleMenuModal}>
            <ModalHeader toggle={toggleMenuModal}>Ürün Ekle</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleAddMenuItem}>
                <FormGroup>
                  <Label for="itemName">Ürün Adı</Label>
                  <Input
                    type="text"
                    name="itemName"
                    id="itemName"
                    value={newMenuItem.itemName}
                    onChange={handleNewMenuItemChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Fiyat</Label>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    value={newMenuItem.price}
                    onChange={handleNewMenuItemChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="rating">Puan</Label>
                  <Input
                    type="number"
                    name="rating"
                    id="rating"
                    value={newMenuItem.rating}
                    onChange={handleNewMenuItemChange}
                    min={1}
                    max={10}
                    required
                    placeholder="1-10"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="image">Resim</Label>
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
                <FormGroup className="mb-3">
                  <Label for="comment" className="form-label">
                    Yorum (isteğe bağlı)
                  </Label>
                  <Input
                    type="text"
                    name="comment"
                    id="comment"
                    value={newMenuItem.comment}
                    onChange={handleNewMenuItemChange}
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  Ekle
                </Button>
              </Form>
            </ModalBody>
          </Modal>
          {/* Comment On Menu Modal */}
          <Modal
            isOpen={commentOnMenuModalOpen}
            toggle={toggleCommentOnMenuModal}
          >
            <ModalHeader toggle={toggleCommentOnMenuModal}>
              Yorum Ekle
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleAddCommentOnMenu}>
                <FormGroup>
                  <Label for="author">Adınız</Label>
                  <Input
                    type="text"
                    name="author"
                    id="author"
                    value={author}
                    onChange={handleNewCommentChange}
                    required
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="content">Yorumunuz</Label>
                  <Input
                    type="textarea"
                    name="content"
                    id="content"
                    value={commentValue}
                    onChange={handleNewCommentChange}
                    required
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  Ekle
                </Button>
              </Form>
            </ModalBody>
          </Modal>
          {/* Comment Modal */}
          <Modal isOpen={commentModalOpen} toggle={toggleCommentModal}>
            <ModalHeader toggle={toggleCommentModal}>Yorum Ekle</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleAddComment}>
                <FormGroup>
                  <Label for="author">Adınız</Label>
                  <Input
                    type="text"
                    name="author"
                    id="author"
                    value={author}
                    onChange={handleNewCommentChange}
                    required
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="content">Yorumunuz</Label>
                  <Input
                    type="textarea"
                    name="content"
                    id="content"
                    value={commentValue}
                    onChange={handleNewCommentChange}
                    required
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  Ekle
                </Button>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </Container>
  );
}

export default PlaceDetail;
