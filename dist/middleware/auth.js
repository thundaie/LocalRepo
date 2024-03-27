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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
require("dotenv").config();
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.headers;
        if (!token) {
            res.status(401).json({
                message: "Token is missing. You have to be authorized to access this route",
            });
            return;
        }
        let result;
        try {
            const verificationResult = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            result = verificationResult;
        }
        catch (e) {
            res.status(401).json({
                message: "Failed to authenticate user",
            });
            return;
        }
        try {
            const user = yield userModel_1.default.findOne({ username: result["username"] });
            if (!user) {
                res.status(401).json({
                    message: "User not found. You have to be signed in to access this route",
                });
            }
            // res.status(200)
            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error.",
            });
        }
    });
}
exports.default = authenticate;
