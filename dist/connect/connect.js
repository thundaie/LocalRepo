"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDb(CONNECTION_URI) {
    mongoose_1.default.connect(CONNECTION_URI);
    mongoose_1.default.connection.on("connected", () => {
        console.log("The database connection has been established");
    });
    mongoose_1.default.connection.on("error", (error) => {
        console.log(error);
    });
}
exports.default = connectDb;
