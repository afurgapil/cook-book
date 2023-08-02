const router = require("express").Router();
const Place = require("../models/places");

// add place
router.post("/add", async (req, res) => {
  const {
    author,
    city,
    district,
    placeName,
    cleanliness,
    staffAttitude,
    comments,
    menu,
  } = req.body;

  try {
    const place = new Place({
      author: author,
      city: city,
      district: district,
      placeName: placeName,
      cleanliness: cleanliness,
      staffAttitude: staffAttitude,
      comments: comments,
      menu: menu,
    });
    await place.save();
    res.status(201).json(place);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all places
router.get("/get", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});
// Get a  place
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Error getting Place" });
  }
});
//add menuItem
router.post("/addMenuItem/:id", async (req, res) => {
  const { id } = req.params;
  const { author, itemName, price, rating, itemImage, comment } = req.body;
  try {
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ error: "Mekan bulunamadı" });
    }

    const newMenuItem = {
      author,
      itemName,
      price,
      rating,
      itemImage,
      comments: [],
    };

    if (comment) {
      const newComment = {
        author,
        content: comment,
        createdAt: Date.now(),
      };
      newMenuItem.comments.push(newComment);
    }

    place.menu.push(newMenuItem);
    await place.save();

    res.status(201).json(newMenuItem);
  } catch (err) {
    console.error("Menü öğesi eklerken hata:", err);
    res.status(500).json({ error: "Menü öğesi eklenirken bir hata oluştu" });
  }
});
//add comment on menu
router.post("/addCommentOnMenu/:id/:selectedMenuItemId", async (req, res) => {
  const { id, selectedMenuItemId } = req.params;
  const { author, content } = req.body;
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    let selectedMenuItem = null;

    for (const menuItem of place.menu) {
      if (menuItem._id.toString() === selectedMenuItemId) {
        selectedMenuItem = menuItem;
        break;
      }
    }

    if (!selectedMenuItem) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    const newComment = {
      author,
      content,
      createdAt: Date.now(),
    };

    selectedMenuItem.comments.push(newComment);
    await place.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

router.post("/addComment/:id", async (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    const newComment = {
      author,
      content,
      createdAt: Date.now(),
    };

    place.comments.push(newComment);
    await place.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

module.exports = router;
