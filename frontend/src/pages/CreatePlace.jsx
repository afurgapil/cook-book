import { useState, useEffect, useContext } from "react";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import citiesData from "../data/cities.json";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
const CreatePlace = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [place, setPlace] = useState({
    author: "",
    city: "",
    district: "",
    placeName: "",
    cleanliness: "",
    staffAttitude: "",
  });

  useEffect(() => {
    if (user) {
      const name = user.username;
      setPlace((prevPlace) => ({
        ...prevPlace,
        author: name,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/place/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(place),
      });
      const data = await response.json();
      navigate(`/mekan/${data._id}`);
      console.log("Yeni mekan eklendi:", data);
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  return (
    <Container className="my-5" id="page">
      <h1>Yeni Mekan Ekle</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="author">Yazar</Label>
          <Input
            type="text"
            name="author"
            id="author"
            value={place.author}
            onChange={handleChange}
            readOnly
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="city">Şehir</Label>
          <Input
            type="select"
            name="city"
            id="city"
            value={place.city}
            onChange={handleChange}
            required
          >
            <option value="">Şehir seçin</option>
            {citiesData.map((cityItem) => (
              <option key={cityItem.cityName} value={cityItem.cityName}>
                {cityItem.cityName}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="district">Semt</Label>
          <Input
            type="select"
            name="district"
            id="district"
            value={place.district}
            onChange={handleChange}
            required
          >
            <option value="">Semt seçin</option>
            {citiesData
              .find((cityItem) => cityItem.cityName === place.city)
              ?.districts.map((districtItem) => (
                <option key={districtItem} value={districtItem}>
                  {districtItem}
                </option>
              ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="placeName">Mekan Adı</Label>
          <Input
            type="text"
            name="placeName"
            id="placeName"
            value={place.placeName}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="cleanliness">Temizlik</Label>
          <Input
            type="number"
            name="cleanliness"
            id="cleanliness"
            value={place.cleanliness}
            onChange={handleChange}
            min={1}
            max={10}
            required
            placeholder="Lütfen 1-10 arasında bir değer giriniz."
          />
        </FormGroup>
        <FormGroup>
          <Label for="staffAttitude">Çalışanların İlgisi</Label>
          <Input
            type="number"
            name="staffAttitude"
            id="staffAttitude"
            value={place.staffAttitude}
            onChange={handleChange}
            min={1}
            max={10}
            required
            placeholder="Lütfen 1-10 arasında bir değer giriniz."
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Ekle
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePlace;
