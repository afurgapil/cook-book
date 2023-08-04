import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";

const CreateIngredient = () => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [isAvailable] = useState(false);
  const [category, setCategory] = useState("");
  const handleCreateIngredient = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/ingredients/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isAvailable,
          category,
        }),
      });

      if (response.ok) {
        setCategory("");
        setName("");
        toast.success("Malzeme Kaydedildi!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.error("Failed to create ingredient.");
      }
    } catch (error) {
      console.error("Failed to create ingredient.", error);
    }
  };

  return (
    <Container id="page">
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
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mt-1">Malzeme Ekle</h2>
          <Form onSubmit={handleCreateIngredient}>
            <FormGroup>
              <Label for="name">Adı:</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="category">Kategorisi:</Label>
              <Input
                type="select"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option disabled value="">
                  Kategori Seçiniz
                </option>
                <option value="Baharat">Baharat</option>
                <option value="Bakliyat">Bakliyat</option>
                <option value="Dondurulmuş Ürünler">Dondurulmuş Ürünler</option>
                <option value="Kahvaltılık">Kahvaltılık</option>
                <option value="Meyve">Meyve</option>
                <option value="Sebze">Sebze</option>
                <option value="Temel Gida">Temel Gıda</option>
                <option value="Şarküteri">Şarküteri</option>
                <option value="Süt Ürünleri">Süt Ürünleri</option>
                <option value="Unlu Mamül">Unlu Mamül</option>
                <option value="Yağ">Yağ</option>
              </Input>
            </FormGroup>
            <Button color="primary" type="submit">
              Malzemeyi Ekle
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateIngredient;
