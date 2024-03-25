const express = require("express")
const signIn = express.Router()
import {signInValidator}  from "../validator/validator"
import {logIn} from "../controller/controller"
import { Request, Response } from "express"



signIn.get("/", (req: Request, res: Response) => {
    res.json({
        message: "SignUp Page to be rendered"
    })
})


signIn.post("/", signInValidator, logIn)


export default signIn;