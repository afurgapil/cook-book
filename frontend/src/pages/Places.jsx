import { useState, useEffect } from "react";
import API_URL from "../config";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import {
  MdCleaningServices,
  MdRoomService,
  MdComment,
  MdMenuBook,
} from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
function Places() {
  const [places, setPlaces] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${API_URL}/place/get`);
      if (response.ok) {
        const data = await response.json();
        setPlaces(data);
      } else {
        throw new Error("Failed to fetch places.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sortPlaces = (places) => {
    switch (sortBy) {
      case "alphabeticalOne":
        return places
          .slice()
          .sort((a, b) => a.placeName.localeCompare(b.placeName));
      case "alphabeticalTwo":
        return places
          .slice()
          .sort((a, b) => b.placeName.localeCompare(a.placeName));
      case "menuCountUp":
        return places.slice().sort((a, b) => a.menu.length - b.menu.length);
      case "menuCountDown":
        return places.slice().sort((a, b) => b.menu.length - a.menu.length);
      case "commentCountUp":
        return places
          .slice()
          .sort((a, b) => a.comments.length - b.comments.length);
      case "commentCountDown":
        return places
          .slice()
          .sort((a, b) => b.comments.length - a.comments.length);
      case "cleaningUp":
        return places.slice().sort((a, b) => a.cleanliness - b.cleanliness);
      case "cleaningDown":
        return places.slice().sort((a, b) => b.cleanliness - a.cleanliness);
      case "serviceUp":
        return places.slice().sort((a, b) => a.staffAttitude - b.staffAttitude);
      case "serviceDown":
        return places.slice().sort((a, b) => b.staffAttitude - a.staffAttitude);
      default:
        return places;
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Container id="page">
      <div className="m-2 d-flex justify-content-between flex-row align-items-center border-bottom border-1 border-black">
        <h2>Mekanlar</h2>
        <div className="my-3">
          <select
            id="sort"
            className="form-select bg-danger-subtle "
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">Sıralama seçin</option>
            <option value="alphabeticalOne">Alfabetik (a-z)</option>
            <option value="alphabeticalTwo">Alfabetik (z-a)</option>
            <option value="menuCountUp">Menü Sayısı ↑</option>
            <option value="menuCountDown">Menü Sayısı ↓</option>
            <option value="commentCountUp">Yorum Sayısı ↑</option>
            <option value="commentCountDown">Yorum Sayısı ↓</option>
            <option value="cleaningUp">Temizlik Puanı ↑</option>
            <option value="cleaningDown">Temizlik Puanı ↓</option>
            <option value="serviceUp">Hizmet Puanı↑</option>
            <option value="serviceDown">Hizmet Puanı↓</option>
          </select>
        </div>
      </div>
      <Button
        onClick={handleSidebarToggle}
        color="primary"
        style={{
          position: "fixed",
          top: "23%",
          left: isSidebarOpen ? "125px" : "20px",
          transform: "translate(-50%, -50%)",
          zIndex: 999,
          transition: " 0.3s",
        }}
        className="z-n1"
      >
        {isSidebarOpen ? (
          <div className="d-flex align-items-center">
            <FaArrowLeft size={24} />
            <Link to="/mekan-ekle" className="text-white  text-decoration-none">
              Favori Mekanlarinizi Ekleyin
            </Link>
          </div>
        ) : (
          <FaArrowRight size={24} />
        )}
      </Button>
      {places.length > 0 ? (
        <Row className="my-5">
          {sortPlaces(places).map((place) => (
            <Col key={place._id} xs="12" md="12" lg="12">
              <div className="p-4 mb-4 rounded-lg bg-danger-subtle border border-1 border-black d-flex flex-row w-100 justify-content-between align-items-center">
                <div
                  className="d-flex flex-column justify-content-start"
                  style={{ width: "33%" }}
                >
                  <h4 className="">{place.placeName}</h4>
                  <h5>
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
                <div className="d-flex  align-self-end">
                  <Link to={`/mekan/${place._id}`} className="btn btn-primary">
                    Detaylar
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="my-5">
          <h3>Mekan bulunamadı.</h3>
          <Link to="/mekan-ekle" className="btn btn-success btn-lg">
            Siz Eklemek İstemez misiniz?
          </Link>
        </Row>
      )}
    </Container>
  );
}

export default Places;
