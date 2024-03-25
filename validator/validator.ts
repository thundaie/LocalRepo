import joi from "joi"
import { Request, Response } from "express"



const newTask = joi.object({
    username: joi.string()
        .required()
        .min(1)
        .max(30)
        .trim(),
    email: joi.string()
        .required()
        .trim(),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
})


const logIn = joi.object({
    username: joi.string()
        .required()
        .min(1)
        .max(30)
        .trim(),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
})


const signUpValidator = async(req: Request, res: Response, next: CallableFunction): Promise<void> => {
    const { username, email, password } = req.body
    const bodyPayload = { username, email, password }

    try {
        await newTask.validateAsync(bodyPayload)
        next()
    } catch (error) {
        console.log(error)
        res.json({
            message: "Please Input the correct values into the relevant fields"
        })
    }
}

const signInValidator = async(req: Request, res: Response, next: CallableFunction): Promise<void> => {
    const { username, password } = req.body
    const bodyPayload = { username, password }

    try {
        await logIn.validateAsync(bodyPayload)
        next()
    } catch (error) {
        console.log(error)
        res.json({
            message: "Please Input the correct values into the relevant fields"
        })
    }
}



export {
    signInValidator,
    signUpValidator
}
