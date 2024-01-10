const jwt = require("jsonwebtoken");
//verify if token is valid
function verify(req, res, next) {
  const authHeader = req.headers.token; //we use post with token in req header(not body)
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // split so we take the token only without any string

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Token is not valid!"); //if token is expired or altered there will be error
      req.user = user;
      next(); // use next to go to router
    });
  } else {
    return res.status(401).json("You are not authenticated!"); //if there is no token sent in the header
  }
}

module.exports = verify;
