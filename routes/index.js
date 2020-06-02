var express = require("express");
var router = express.Router();
require("dotenv").config();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../database/models/users");
const MessagesModel = require("../database/models/messsages");

function verifyJWT(req, res, next) {
  var auth = req.headers["authorization"];
  if (!auth)
    return res.status(401).send({ auth: false, message: "No token provided." });
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    console.error(err);
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded._id;
    next();
  });
}

/* GET home page. */
router.get("/", function (req, res, _) {
  res.render("index", { title: "Express" });
});
/* GET all users. */
router.get("/users", async (req, res, _) => {
  const users = await User.find({});
  try {
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
/* POST all users. */

router.post("/register", async (req, res) => {
  // Create a new user
  try {
    const exists = await User.findOne({email: req.body.email})
    if(!exists){
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      return res.status(201).send({ user, token });
    } else {
      return res.status(400).send({ error: 'Conta já existente' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//authentication
router.post("/login", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/logout", verifyJWT, function (req, res) {
  res.status(200).send({ auth: false, token: null });
});
// Messages
router.get("/messages", verifyJWT, async (req, res) => {
  const messages = await MessagesModel.find({});
  return res.status(200).send(messages);
});
//GET -> Recupera algo
//PUT -> Edita algo
//DELETE -> Deleta
//POST -> Cria alguma
// new Message
router.post("/messages", verifyJWT, async (req, res) => {
  if (req.body.message) {
    let name = "";
    await User.findById(req.userId, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        name = user.name;
      }
    });
    const message = {
      sent_by: req.userId,
      name: name,
      content: req.body.message,
      created_at: new Date(),
    };
    await MessagesModel.create(message, async (err, mess) => {
      if (err) {
        console.error(err)
        return res.status(422).send(err);
      } else {
        return res.status(200).send(mess);
      }
    });
  } else {
    return res.status(400).send("No message provided");
  }
});
module.exports = router;
