"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const signIn = express.Router();
const validator_1 = require("../validator/validator");
const controller_1 = require("../controller/controller");
signIn.get("/", (req, res) => {
    res.json({
        message: "SignUp Page to be rendered"
    });
});
signIn.post("/", validator_1.signInValidator, controller_1.logIn);
exports.default = signIn;
