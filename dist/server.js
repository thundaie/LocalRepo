"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv").config();
const connect_1 = __importDefault(require("./connect/connect"));
//Database connection
(0, connect_1.default)(process.env.CONNECTION_URI);
//Basic
app_1.default.get("/", (req, res) => {
    res.json({
        message: "Welcome"
    });
});
//Server
app_1.default.listen(3001, () => {
    console.log("Server is running");
});
/*
1. API to sign up as that is the first page the user hits
2. JWT for token(Look into making it a one time use, so maybe no need to pass as cookie)
3. Sign in to complete Auth.()
4. On log in, the route should serve all regions as it is the first

*/
