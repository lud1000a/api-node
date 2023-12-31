const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {

  if (!req.headers.authorization) {
    res.status(401).json({ erro: "not authorized" })
  } else {

    const token = req.headers["authorization"].replace('Bearer ', "");

    jwt.verify(token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {

          return res.status(401).send({
            erro: "Unauthorized!",
          });
        }
        req.userId = decoded.id;
        next();
      });
  }
};