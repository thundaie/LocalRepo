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
exports.getLocalGovernment = exports.getStates = exports.getRegions = exports.logIn = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const state_1 = __importDefault(require("../model/state"));
const region_1 = __importDefault(require("../model/region"));
const lga_1 = __importDefault(require("../model/lga"));
const userModel_1 = __importDefault(require("../model/userModel"));
const cache_1 = require("../cache/cache");
const DATA_EXPIRY_TIME = 1000;
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        const bodyPayload = { username, email, password };
        if ((yield userModel_1.default.find({ username: username })).length) {
            res.status(400).json({
                message: "Error, Username already exists"
            });
            return;
        }
        try {
            const newUser = new userModel_1.default(bodyPayload);
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ username: bodyPayload.username }, process.env.JWT_SECRET);
            res.json({
                message: "Sign up complete, please authenticate your route access with this attached token",
                token
            });
        }
        catch (error) {
            res.status(500).json({
                messsage: "500, Error occured while trying to create User",
            });
        }
    });
}
exports.register = register;
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const user = yield userModel_1.default.findOne({ username: username });
            // console.log("user found")
            if (!user || !user.comparePassword(password)) {
                res.statusCode = 404;
                res.json({
                    message: "404, User not found"
                });
            }
            res.statusCode = 200;
            res.json({
                message: "Logged In successfully"
            });
        }
        catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.json({
                message: "An error occured while trying to log in"
            });
        }
    });
}
exports.logIn = logIn;
function getRegions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = req.query.name || "";
        const cacheKey = `regions#${name}`;
        const cache = (0, cache_1.getRedisInstance)();
        const result = yield cache.get(cacheKey);
        if (result) {
            res.status(200).json({ regions: result });
            return;
        }
        let query = {};
        if (name)
            query["name"] = { $regex: name, $options: "i" };
        const regions = yield region_1.default.find(query);
        if (regions.length > 0) {
            // only write in cache when we actually have data to write
            yield cache.set(cacheKey, regions, { ex: DATA_EXPIRY_TIME });
        }
        res.status(200).json({ regions: regions });
    });
}
exports.getRegions = getRegions;
function getStates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cache = (0, cache_1.getRedisInstance)();
        let cacheKey = "states";
        const query = {}; // empty query which means to fetch all data
        if (req.query.region) {
            cacheKey += "#" + req.query.region; // this makes the cache key unique
            query["region"] = req.query.region; // finds all states with the same region id
        }
        if (req.query.name) {
            cacheKey += "#" + req.query.name; // this makes the cache key unique
            query["name"] = { $regex: req.query.name, $options: "i" }; // sets a regex query on the name field
        }
        const result = yield cache.get(cacheKey); // fetch data from cache that match key
        if (result) {
            res.status(200).json({ states: result });
            return;
        }
        const states = yield state_1.default.find(query).populate("region"); // populates the region field by fetching the data that matches the id from the database
        if (states.length > 0) {
            yield cache.set(cacheKey, states, { ex: DATA_EXPIRY_TIME });
        }
        res.status(200).json({ states: states });
    });
}
exports.getStates = getStates;
function getLocalGovernment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let cacheKey = "lgas";
        const cache = (0, cache_1.getRedisInstance)();
        const query = {};
        if (req.query.name) {
            cacheKey += "#" + req.query.name;
            query["name"] = { $regex: req.query.name, $options: "i" };
        }
        if (req.query.region) {
            query["region"] = req.query.region;
            cacheKey += "#" + req.query.region;
        }
        if (req.query.state) {
            query["state"] = req.query.state;
            cacheKey += "#" + req.query.state;
        }
        const lgas = yield lga_1.default.find(query) // finds all lgas that match the query
            .populate("region") // populates the region field by fetching the data that matches the id from the database
            .populate("state", "-state.region"); // populates the state field by fetching the data that matches the id from the database, "-state.region" means to remove the region id from the fetched state data
        if (lgas.length > 0) {
            yield cache.set(cacheKey, lgas, { ex: DATA_EXPIRY_TIME });
        }
        res.status(200).json({ lgas: lgas });
    });
}
exports.getLocalGovernment = getLocalGovernment;
