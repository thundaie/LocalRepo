"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_xss_sanitizer_1 = require("express-xss-sanitizer");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
require("dotenv").config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//New
const login_1 = __importDefault(require("./routes/login"));
const signup_1 = __importDefault(require("./routes/signup"));
const auth_1 = __importDefault(require("./middleware/auth"));
const region_1 = __importDefault(require("./routes/region"));
const state_1 = __importDefault(require("./routes/state"));
const lga_1 = __importDefault(require("./routes/lga"));
//Rate Limiter
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
//Middlewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_xss_sanitizer_1.xss)());
app.use(rateLimiter);
//Routes
app.use("/signin", login_1.default);
app.use("/signup", signup_1.default);
app.use("/regions", auth_1.default, region_1.default);
app.use("/states", auth_1.default, state_1.default);
app.use("/localgov", auth_1.default, lga_1.default);
exports.default = app;
