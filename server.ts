import app from "./app"
require("dotenv").config();
import { Request, Response } from "express";


import connectDb from "./connect/connect";

//Database connection
connectDb(process.env.CONNECTION_URI as string);

//Basic
app.get("/", (req: Request, res: Response): void => {
  res.json({
    message: "Welcome"
  });
});

//Server
app.listen(3001, () => {
  console.log("Server is running")
});

/*
1. API to sign up as that is the first page the user hits
2. JWT for token(Look into making it a one time use, so maybe no need to pass as cookie)
3. Sign in to complete Auth.()
4. On log in, the route should serve all regions as it is the first

*/
