var express = require("express");
var router = express.Router();
var User = require("../../../models/user");
var Test = require("../../../models/test");
var Question = require("../../../models/question");
var bcrypt = require("bcryptjs");

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
  const { password } = req.body;

  email == "admin@swot.com"
    ? User.findOne({ email }, (err, user) => {
        if (err) return next(err);
        if (!user) {
          req.body.userType = "L1";
          req.body.userRole = "Admin";
          User.create(req.body, async (err, createdUser) => {
            if (err) return next(err);
            var token = await auth.generateJWT(createdUser);
            res.json({
              data: createdUser,
              type: "users",
              success: true,
              token,
            });
          });
        } else {
          res.json({
            type: "users",
            success: false,
            message: "Email already used",
          });
        }
      })
    : User.findOne({ email }, (err, user) => {
        req.body.password = bcrypt.hashSync(password, 10);
        if (err) return next(err);
        if (user && !user.firstName) {
          User.findByIdAndUpdate(user.id, req.body, { new: true })
            .populate({
              path: "clients",
              populate: {
                path: "clients",
                populate: {
                  path: "clients",
                  populate: {
                    path: "clients",
                  },
                },
              },
            })
            .exec(async (err, createdUser) => {
              if (err) return next(err);
              var token = await auth.generateJWT(createdUser);
              res.json({
                data: createdUser,
                type: "users",
                success: true,
                token,
              });
            });
        } else {
          console.log(user);
          res.json({
            type: "users",
            success: false,
            message: user ? "Email already used" : "unauthorized Email",
          });
        }
      });
});

//experiment
router.post("/user/add", (req, res) => {
  console.log(req.body);
  var { id, email, userType, userRole } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return res.json({ type: "user", success: false });
    if (!user) {
      User.create({ email, userType, userRole }, (err, createdUser) => {
        if (err) return next(err);
        User.findByIdAndUpdate(
          id,
          { $push: { clients: createdUser.id } },
          (err, updated) => {
            err
              ? res.json({ success: false, err })
              : res.json({ success: true });
          }
        );
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
//done

router.post("/login", (req, res) => {
  var { email, password } = req.body;
  User.findOne({ email })
    .populate({
      path: "clients",
      populate: {
        path: "clients",
        populate: {
          path: "clients",
          populate: {
            path: "clients",
          },
        },
      },
    })
    .exec(async (err, user) => {
      if (!user.password)
        return res.json({
          type: "user",
          success: false,
          message: "Initial Sign in Required",
        });
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
  var user = await User.findById(req.user.userId).populate({
    path: "clients",
    populate: {
      path: "clients",
      populate: {
        path: "clients",
        populate: {
          path: "clients",
        },
      },
    },
  });
  res.json({ success: true, user });
});

router.post("/fetch/user", async (req, res) => {
  try {
    var user = await User.findById(req.body.id).populate("clients");
    console.log(user);
    res.json({ success: true, user });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.post("/test", (req, res) => {
  var data = req.body;
  Test.create(data, (err, createdTest) => {
    err
      ? res.json({ success: false })
      : res.json({ success: true, createdTest });
  });
});

router.post("/test/question", (req, res) => {
  var data = req.body;
  Question.create(data, (err, createdQuestion) => {
    !err
      ? Test.findByIdAndUpdate(
          createdQuestion.title,
          { $push: { questions: createdQuestion.id } },
          (err, updated) => {
            err
              ? res.json({ success: false, err })
              : res.json({ success: true, createdQuestion });
          }
        )
      : res.json({ success: false, err });
  });
});

router.get("/tests", async (req, res) => {
  try {
    var allTests = await Test.find({}).populate("questions");
    res.json({ success: true, allTests });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.delete("/test", (req, res) => {
  Question.find({ title: req.body.id }).remove();
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
