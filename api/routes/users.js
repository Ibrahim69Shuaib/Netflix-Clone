const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");

//UPDATE for admin dashboard

router.put("/:id", verify, async (req, res) => {
  // verify to check for our jwt token
  // if user is admin the he is allowed to update
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        //searching for user by id
        req.params.id,
        {
          $set: req.body, // updating requested body
        },
        { new: true } //to return the new user in the response not the old one
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account!"); // error if user is not admin
  }
});

//DELETE for admin dashboard
router.delete("/:id", verify, async (req, res) => {
  // if user is admin the he is allowed to delete
  // similar to update method
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

//GET
//no verify because anyone should be able to see his information through get
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc; // we don't want to return all information (password) so we take out password from the doc and use "info"
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL for admin dashboard
router.get("/", verify, async (req, res) => {
  const query = req.query.new; // new is the name of the query....can be anything
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5) // if there is query its gonna fetch only first 5 users
        : await User.find(); //if there is no query its gonna fetch all users
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all users!"); //if user is not admin
  }
});

//GET USER STATS
router.get("/stats", async (req, res) => {
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
//add new user (to be used in admin dashboard)
router.post("/create", verify, async (req, res) => {
  // async => await       always
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    profilePic: req.body.profilePic,
    IsAdmin: req.body.IsAdmin,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/userStats");

module.exports = router;
