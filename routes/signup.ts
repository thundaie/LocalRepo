import express from "express"
const signUp = express.Router()
import {signUpValidator} from "../validator/validator"
import {register} from "../controller/controller"



signUp.get("/", (req, res) => {
    res.json({
        message: "SignUp Page to be rendered"
    })
})


signUp.post("/", signUpValidator, register)


export default signUp