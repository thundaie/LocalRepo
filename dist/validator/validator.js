"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidator = exports.signInValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const newTask = joi_1.default.object({
    username: joi_1.default.string()
        .required()
        .min(1)
        .max(30)
        .trim(),
    email: joi_1.default.string()
        .required()
        .trim(),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
});
const logIn = joi_1.default.object({
    username: joi_1.default.string()
        .required()
        .min(1)
        .max(30)
        .trim(),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
});
const signUpValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const bodyPayload = { username, email, password };
    try {
        yield newTask.validateAsync(bodyPayload);
        next();
    }
    catch (error) {
        console.log(error);
        res.json({
            message: "Please Input the correct values into the relevant fields"
        });
    }
});
exports.signUpValidator = signUpValidator;
const signInValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const bodyPayload = { username, password };
    try {
        yield logIn.validateAsync(bodyPayload);
        next();
    }
    catch (error) {
        console.log(error);
        res.json({
            message: "Please Input the correct values into the relevant fields"
        });
    }
});
exports.signInValidator = signInValidator;
