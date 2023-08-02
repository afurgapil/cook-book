import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import { Link } from "react-router-dom";
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import { BiMoney } from "react-icons/bi";
import { GiThink } from "react-icons/gi";
import { SiFastly } from "react-icons/si";
import API_URL from "../config";
const items = [
  {
    src: img1,
    altText: "Slide 1",
    caption: "Öğrenci Dostu Lezzetler",
    buttonText: "Hemen Keşfet",
    buttonClass: "btn-primary",
    isActive: true,
    path: "/tarifler",
    key: 1,
  },
  {
    src: img2,
    altText: "Slide 2",
    caption: "Bugün Ne Yesem Sorusuna Son!",
    buttonText: "Pişir!",
    buttonClass: "btn-danger",
    isActive: true,
    path: "/yemekler",

    key: 2,
  },
  {
    src: img3,
    altText: "Slide 3",
    caption: "Öğrenci Dostu Mekanlar",
    buttonText: "İncele",
    buttonClass: "btn-warning",
    isActive: true,
    path: "/mekanlar",

    key: 3,
  },
];
const images = [
  { name: "image1", path: "../src/assets/place/Dosya 1.jpg" },
  { name: "image2", path: "../src/assets/place/Dosya 2.jpg" },
  { name: "image3", path: "../src/assets/place/Dosya 3.jpg" },
  { name: "image4", path: "../src/assets/place/Dosya 4.jpg" },
  { name: "image5", path: "../src/assets/place/Dosya 5.jpg" },
  { name: "image6", path: "../src/assets/place/Dosya 6.jpg" },
  { name: "image7", path: "../src/assets/place/Dosya 7.jpg" },
  { name: "image8", path: "../src/assets/place/Dosya 8.jpg" },
  { name: "image9", path: "../src/assets/place/Dosya 9.jpg" },
  { name: "image10", path: "../src/assets/place/Dosya 10.jpg" },
  { name: "image11", path: "../src/assets/place/Dosya 11.jpg" },
  { name: "image12", path: "../src/assets/place/Dosya 12.jpg" },
  { name: "image13", path: "../src/assets/place/Dosya 13.jpg" },
  { name: "image14", path: "../src/assets/place/Dosya 14.jpg" },
  { name: "image15", path: "../src/assets/place/Dosya 15.jpg" },
  { name: "image16", path: "../src/assets/place/Dosya 16.jpg" },
];

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [allRecipes, setAllRecipes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sortedRecipes, setSortedRecipes] = useState([]);
  useEffect(() => {
    fetchRecipes();
    fetchPlaces();
  }, []);
  useEffect(() => {
    const sortedArray = allRecipes.sort(
      (a, b) => b.likes.length - a.likes.length
    );
    const topthree = sortedArray.slice(0, 3);
    setSortedRecipes(topthree);
  }, [allRecipes]);
  useEffect(() => {
    const getRandomIndexesFromArray = (arr, count) => {
      if (arr.length < count) {
        count = arr.length;
      }
      if (!Array.isArray(arr) || arr.length === 0 || count <= 0) {
        return [];
      }

      const randomIndexes = [];
      const maxIndex = arr.length - 1;

      while (randomIndexes.length < count) {
        const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }

      return randomIndexes.map((index) => arr[index]);
    };
    const selectedItems = getRandomIndexesFromArray(places, 3);
    setSelectedPlaces(selectedItems);
    const getRandomItemsFromArray = (arr, count) => {
      if (arr.length < count) {
        count = arr.length;
      }
      if (!Array.isArray(arr) || arr.length === 0 || count <= 0) {
        return [];
      }

      const shuffledArray = arr.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
          shuffledArray[j],
          shuffledArray[i],
        ];
      }

      return shuffledArray.slice(0, count);
    };

    const selectedImages = getRandomItemsFromArray(images, 3);
    setSelectedImages(selectedImages);
  }, [places]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe/get`);
      if (response.ok) {
        const data = await response.json();
        setAllRecipes(data);
      } else {
        throw new Error("Failed to fetch recipes.");
      }
    } catch (error) {
      console.error(error);
    }
  };
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
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };
  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <div style={{ position: "relative" }}>
          <img
            src={item.src}
            alt={item.altText}
            style={{
              width: "100%",
              height: "85vh",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              color: "#fff",
              textAlign: "center",
            }}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <h2 className="" style={{ fontSize: "5rem" }}>
              {item.caption}
            </h2>
            <Link
              className={`fs-1 btn ${item.buttonClass}`}
              style={{ pointerEvents: item.isActive ? "auto" : "none" }}
              to={item.path}
            >
              {item.buttonText}
            </Link>
          </div>
        </div>
      </CarouselItem>
    );
  });

  return (
    <div id="page" className=" mx-0 px-0 w-100">
      <Carousel activeIndex={activeIndex} next={next} previous={previous}>
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
      <div className="row " style={{ color: "#362E27" }}>
        <div className="col  m-5 d-flex flex-column justify-content-center align-items-center border border-1 border-black">
          <BiMoney
            className="mt-2"
            style={{ fontSize: "5rem", color: "#362E27" }}
          ></BiMoney>
          <div className="border-bottom border-1 border-black w-75 text-center mb-3 fw-bolder fs-1">
            UCUZ
          </div>
          <div className="m-2 pb-4">
            Elindeki malzemelerle muhteşem yemekler yapmanın maliyeti artık bir
            sorun değil! Size, bütçenize uygun ve ekonomik tarifler sunarak,
            harcadığınız parayı minimumda tutmanızı sağlıyoruz.
          </div>
        </div>
        <div className="col  m-5 d-flex flex-column justify-content-center align-items-center border border-1 border-black">
          <GiThink
            className="mt-2"
            style={{ fontSize: "5rem", color: "#362E27" }}
          ></GiThink>
          <div className="border-bottom border-1 border-black w-75 text-center mb-3 fw-bolder fs-1">
            ZAHMETSİZ
          </div>
          <div className="m-2 pb-4">
            Mutfakta geçirdiğiniz zaman artık dert değil! Sadece elinizdeki
            malzemeleri seçin, ardından size adım adım kolay ve hızlı tarifler
            sunarak, yemek yapma sürecini keyifli ve zahmetsiz hale getirelim.
          </div>
        </div>
        <div className="col  m-5 d-flex flex-column justify-content-center align-items-center border border-1 border-black">
          <SiFastly
            className="mt-2"
            style={{ fontSize: "5rem", color: "#362E27" }}
          ></SiFastly>
          <div className="border-bottom border-1 border-black w-75 text-center mb-3 fw-bolder fs-1">
            HIZLI
          </div>
          <div className="m-2 pb-4">
            Acıkan mideler için kurtarıcı olun! Sizin için en uygun yemeği
            seçelim ve daha fazla vakit kaybetmeyin. Daha fazla zaman
            kaybetmeden lezzet dolu bir yemek deneyimi yaşayın.
          </div>
        </div>
      </div>
      {allRecipes.length > 0 && (
        <div className="row border-top border-3 border-black my-5">
          <h3 className="text-center mt-5 fw-bolder fs-1">POPÜLER TARİFLER</h3>
          <div className="row d-flex flex-row sm-flex-column  justify-content-evenly align-items-center px-0 mx-0 my-5">
            {sortedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="position-relative col-10 col-md-3  d-flex flex-column justify-content-center align-items-center p-0 my-5 my-md-0 border border-black border-1"
                style={{ boxShadow: "0px 19px 15px -3px  #3ca100" }}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  width="100%"
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                ></img>
                <Link
                  to={`/tarif/${recipe._id}`}
                  className="btn btn-success position-absolute top-100 start-50 translate-middle"
                >
                  Keşfet
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      {places.length > 0 && (
        <div className="row border-top border-3 border-black my-5">
          <h3 className="text-center mt-5 fw-bolder fs-1">POPÜLER MEKANLAR</h3>
          <div className="row d-flex flex-row sm-flex-column justify-content-evenly align-items-center px-0 mx-0 my-5">
            {selectedPlaces.map((place, index) => (
              <div
                key={place._id}
                className="position-relative col-10 col-md-3 d-flex flex-column justify-content-center align-items-center p-0 my-5 my-md-0 border border-black border-1"
                style={{ boxShadow: "0px 19px 15px -3px  #FF5733" }}
              >
                <img
                  src={selectedImages[index].path}
                  alt={place.placeName}
                  width="100%"
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    opacity: "50%",
                  }}
                />
                <p
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {place.placeName}
                </p>
                <Link
                  to={`/mekan/${place._id}`}
                  className="btn btn-success position-absolute top-100 start-50 translate-middle"
                >
                  Keşfet
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="my-5 p-5 border-bottom border-top border-3 border-black row ">
        <div className="col-12 col-md-6" style={{ maxHeight: "fit-content" }}>
          <img
            src={img4}
            alt="Kitchen"
            width="100%"
            height="400px"
            style={{ objectFit: "cover" }}
          ></img>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column ">
          <h3 className="text-center fs-1 mt-5 mt-md-0">Ekibin Parçası Ol</h3>
          <p className="fs-5">
            Merhaba! Yemek Tarifleri Ekibimize katılarak mutfaktaki
            yeteneklerinizi ve bilgilerinizi paylaşmaya ne dersiniz? Yemek
            tarifleri, pişirme teknikleri ve mutfakla ilgili her türlü içeriği
            insanlarla buluşturarak onların yemek deneyimlerine katkıda
            bulunabilirsiniz. Yaratıcılığınızı konuşturmak ve lezzetli
            tariflerle milyonlarca kişinin sofrasını renklendirmek için bu
            ekibin bir parçası olabilirsiniz.
          </p>
          <p className="fs-5 fw-light">
            Unutmayın, yemek pişirmek bir sanattır ve siz de bu sanata katkı
            sağlamak için bekliyoruz!
          </p>
          <Link
            to="/basvur"
            className=" btn btn-primary text-center align-self-center "
          >
            Başvuru Formu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
