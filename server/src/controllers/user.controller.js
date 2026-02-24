import UserModel from "../models/user.js";

export async function searchUser(req, res, next) {
  const { username } = req.query;

  const user = await UserModel.findOne({ username }, { _id: 1, username: 1 });
  if (!user) return res.status(404).json({ message: "user not found" });

  return res.json({ user });
}
