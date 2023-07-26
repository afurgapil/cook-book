const router = require("express").Router();
const User = require("../models/users");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const config = require("../config");
dotenv.config();

const TOKEN_EXPIRATION_MINUTES = config.TOKEN_EXPIRATION_MINUTES;
const APP_URL = config.APP_URL;
const generateToken = () => {
  const newToken = uuidv4();
  return newToken;
};
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "apicookbook@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

//signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname, email, ingredients } = req.body;
    const user = await User.create({
      username,
      password,
      name,
      surname,
      email,
      ingredients,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      console.log(duplicatedField);
      return res.status(400).json({
        error: `${duplicatedField} is duplicated`,
      });
    }

    res.status(500).json({ error: "Kullanıcı kaydı gerçekleştirilemedi." });
  }
});
//signin
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error signing in" });
  }
}); // Get users
router.get("/get", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error getting users" });
  }
});

// Update ingredient list for all users
router.put("/update/ingredients", async (req, res) => {
  const newIngredients = req.body.ingredients;
  try {
    const users = await User.find();

    for (const user of users) {
      const trueIngredientsIds = [];
      user.ingredients.forEach((ingredient) => {
        if (ingredient.isAvailable) {
          trueIngredientsIds.push(ingredient._id.toString());
        }
      });
      user.ingredients = newIngredients;

      user.ingredients.forEach((ingredient) => {
        if (trueIngredientsIds.includes(ingredient._id.toString())) {
          ingredient.isAvailable = true;
        }
      });
      try {
        await user.save();
      } catch (error) {
        console.error("User Save Error:", error);
      }
    }

    res.json({ message: "Ingredient list updated for all users successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating ingredient list for all users" });
  }
});
// Update user isAdmin property
router.put("/update/isAdmin/:id", async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.isAdmin = value;
    await user.save();
    res.json({ message: "User has been granted admin privileges" });
  } catch (error) {
    res.status(500).json({ error: "Error granting admin privileges to user" });
  }
});
// GET /user/get/ingredients/:userId
router.get("/get/ingredients/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.ingredients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's ingredients" });
  }
});

// forgot password
router.post("/reset-password", async (req, res) => {
  const userEmail = req.body.email;

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı." });
  }

  try {
    const resetToken = generateToken();
    const time = TOKEN_EXPIRATION_MINUTES / 60000;

    const mailOptions = {
      from: "apicookbook@gmail.com",
      to: userEmail,
      subject: "Şifre Sıfırlama Talebi",
      text: `Merhaba,\n\nŞifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanabilirsiniz:\n\n${APP_URL}/reset-password?token=${resetToken}\n\nBu bağlantı, şifrenizi sıfırlamak için ${time} dakika geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı göz ardı edebilirsiniz.\n\nİyi günler dileriz,\nAPI Cookbook Ekibi`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("E-posta gönderilirken hata oluştu:", error);
      } else {
        console.log("E-posta başarıyla gönderildi:", info.response);
      }
    });

    user.token = resetToken;
    user.tokenEnd = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("E-posta başarıyla gönderildi:", mailOptions);
    res.status(200).json({
      message: "E-posta başarıyla gönderildi.Mail kutunuzu kontrol ediniz",
    });
  } catch (err) {
    console.log("Hata oluştu:", err);
    res
      .status(500)
      .json({ message: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

// reset password
router.post("/reset-password/:token", async (req, res) => {
  const resetToken = req.params.token;

  const user = await User.findOne({
    token: resetToken,
    tokenEnd: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Geçersiz veya süresi dolmuş bir bağlantı." });
  }

  const newPassword = req.body.newPassword;

  try {
    user.password = newPassword;

    user.token = null;
    user.tokenEnd = null;

    await user.save();

    console.log("Şifreniz başarıyla sıfırlandı:", user);
    res.status(200).json({
      message:
        "Şifreniz başarıyla sıfırlandı.Giriş sayfasına yönlendiriliyorsunuz",
    });
  } catch (err) {
    console.log("Hata oluştu:", err);
    res
      .status(500)
      .json({ message: "Bir hata oluştu, lütfen tekrar deneyin." });
  }
});

module.exports = router;
