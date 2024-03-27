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
const populate_1 = __importDefault(require("./populate"));
const connect_1 = __importDefault(require("../connect/connect"));
require("dotenv").config();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        (0, connect_1.default)(process.env.CONNECTION_URI);
        yield (0, populate_1.default)();
    });
})();
// You can do `ts-node utils/run-populate.ts`
// Separated out of the `populate.ts` file so we can re-use during test.
