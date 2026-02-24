import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers?.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ message: "please login first" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(400).json({ message: "invalid token" });
    req.user = user;
    next();
  });
};

export default auth;