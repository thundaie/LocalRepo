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


