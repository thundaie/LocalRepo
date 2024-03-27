"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signUp = express_1.default.Router();
const validator_1 = require("../validator/validator");
const controller_1 = require("../controller/controller");
signUp.get("/", (req, res) => {
    res.json({
        message: "SignUp Page to be rendered"
    });
});
signUp.post("/", validator_1.signUpValidator, controller_1.register);
exports.default = signUp;
