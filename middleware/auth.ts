import jwt, { JwtPayload } from "jsonwebtoken"
import userModel from "../model/userModel"
require("dotenv").config();
import { Request, Response } from "express";


async function authenticate(req: Request, res: Response, next: CallableFunction): Promise<void> {
  const { token } = req.headers

  if (!token) {
    res.status(401).json({
      message: "Token is missing. You have to be authorized to access this route",
    });
    return
  }

  let result: JwtPayload

  try {
    const verificationResult = jwt.verify(token as string, process.env.JWT_SECRET as string);
    result = verificationResult as JwtPayload
  }
  catch(e) {
    res.status(401).json({
      message: "Failed to authenticate user",
    });
    return
  }

  try {
    const user = await userModel.findOne({ username: result["username"] });
    if (!user) {
      res.status(401).json({
        message: "User not found. You have to be signed in to access this route",
      });
    }
    // res.status(200)
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error.",
    });
  }
}


export default authenticate