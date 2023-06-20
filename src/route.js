const express = require("express");
const bcrypt = require("bcryptjs");
require("./dbconnect");
const users = require("./users");
const auth = require("./auth");
const router = express.Router();

var salt = bcrypt.genSaltSync(10);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const finduser = await users.findOne({ email }, { password: 1 });
    if (!finduser) {
      return res.status(404).json({
        msg: "Invalid Email or Password!",
      });
    }
    const compare = await bcrypt.compare(password, finduser.password);
    if (!compare) {
      return res.status(404).json({
        msg: "Invalid Email or Password!",
      });
    }
    res.json({ userid: finduser._id });
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkuser = await users.findOne({ email });
    if (checkuser) {
      return res.status(403).json({
        msg: "Email already Registered!",
      });
    }
    const hashp = await bcrypt.hash(password, salt);
    const result = await users.insertMany({ email, password: hashp });
    res.json({ userid: result[0]._id });
  } catch (error) {
    res.send(error);
  }
});

router.get("/favourite", auth, async (req, res) => {
  const userId = req.query.id;
  const resp = await users.findById(userId, { movielists: 1 });
  res.json(resp.movielists);
});

router.get("/removeFavourite", auth, async (req, res) => {
  const { id, objId } = req.query;
  try {
    const resp = await users.findByIdAndUpdate(id, {
      $pull: {
        movielists: {
          _id: objId,
        },
      },
    });

    res.json({ msg: "OK" });
  } catch (error) {
    res.send(error);
  }
});

router.put("/addFavourite", auth, async (req, res) => {
  const userId = req.query.id;
  const { movieId, title, backdrop } = req.body;
  try {
    const resp = await users.updateOne(
      { _id: userId, movielists: { $not: { $elemMatch: { _id: movieId } } } }, //to check whether same movieId info already present or not
      {
        $push: { movielists: { _id: movieId, title, backdrop } },
      }
    );
    if (resp.modifiedCount) {
      return res.json({ msg: "Added Successfully" });
    }
    return res.json({ msg: "Already Present" });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
