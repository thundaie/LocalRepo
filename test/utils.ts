import jwt from "jsonwebtoken";
import UserModel from "../model/userModel";

const generateToken = (username: string) => {
  return jwt.sign(
    { username },
    process.env.JWT_SECRET as string
  );
}

const createUser = async (username: string, email: string, password: string): Promise<string> => {
  const user = new UserModel({
    username,
    email,
    password
  })
  await user.save();
  return generateToken(username);
}

export {
  generateToken,
  createUser
}