var express = require("express");
var router = express.Router();
var User = require("../../../models/user");
var Test = require("../../../models/test");
var Question = require("../../../models/question");

var auth = require("../../../modules/auth");
const { check, validationResult } = require("express-validator");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ type: "users", success: true });
});

router.get("/signup", function (req, res, next) {
  res.json({ type: "users", success: false });
});

router.post("/signup", (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      User.create(req.body, async (err, createdUser) => {
        if (err) return next(err);
        var token = await auth.generateJWT(createdUser);
        res.json({ data: createdUser, type: "users", success: true, token });
      });
    } else {
      res.json({
        type: "users",
        success: false,
        message: "Email already used",
      });
    }
  });
});

router.post("/login", (req, res) => {
  var { email, password } = req.body;
  User.findOne({ email }, async (err, user) => {
    if (err) return res.json({ type: "user", success: false });
    if (!user)
      return res.json({
        type: "user",
        success: false,
        message: "Email not Registered",
      });
    if (!user.verifyPassword(password))
      return res.json({
        type: "user",
        success: false,
        message: "Incorrect Password",
      });
    var token = await auth.generateJWT(user);
    res.json({ data: user, type: "user", success: true, token });
  });
});

router.get("/me", auth.verifyToken, async (req, res) => {
  var user = await User.findById(req.user.userId);
  res.json({ success: true, user });
});

router.post("/test", (req, res) => {
  var data = req.body;
  Test.create(data, (err, createdTest) => {
    res.json({ success: !err ? true : false });
  });
});

router.post("/test/question", (req, res) => {
  var data = req.body;
  Question.create(data, (err, createdQuestion) => {
    if (err) {
      console.log(err);
    } else {
      Test.findByIdAndUpdate(
        createdQuestion.title,
        { $push: { questions: createdQuestion.id } },
        (err, updated) => {
          if (err) {
            console.log(err);
          } else {
            console.log(updated);
          }
        }
      );
    }
  });
});

router.get("/tests", async (req, res) => {
  try {
    var allTests = await Test.find({}, (err, allTests) => {}).populate(
      "questions"
    );
    res.json({ success: true, allTests });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.delete("/test", (req, res) => {
  Test.findByIdAndRemove(req.body.id, (err, deleted) => {
    res.json({ success: !err ? true : false });
  });
});

router.delete("/test/question", (req, res) => {
  console.log(req.body.id);
  Question.findByIdAndRemove(req.body.id, (err, deleted) => {
    res.json({ success: !err ? true : false });
  });
});

module.exports = router;
