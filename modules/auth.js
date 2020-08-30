const jwt = require("jsonwebtoken");
const { token } = require("morgan");

module.exports = {
  generateJWT: async user => {
    var payload = { userId: user.id };
    var token = await jwt.sign(payload, process.env.SECRET);
    console.log(token)
    return token;
  },
  verifyToken: async (req, res, next) => {
    
    console.log(req.headers)
    var token = req.headers["authorization"] || "";
    if (token) {
      try {
        var payload = jwt.verify(token, process.env.SECRET);
        req.user = payload;
        req.user.token = token;
        next();
      } catch (error) {
        res.json({ message: "invalid token", error });
      }
    } else {
      res.json({ msg: "Token required " });
    }
  }
};