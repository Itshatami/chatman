import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const authentication = async (req, res, next) => {
  const { username, password } = req.body;

  // check username exists
  let user = await UserModel.findOne({ username });
  if (user) {
    if (user.password !== password) {
      return res.status(400).json({ message: "incorrect password" });
    }
  } else {
    user = await UserModel.create({ username, password });
  }

  // token
  const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ message: "authentication successful", token, user });
};
