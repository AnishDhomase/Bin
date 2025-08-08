import UserModel from "../models/user.model.js";

export const createUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = UserModel.create({
    name,
    email,
    password,
  });
  return user;
};
