"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisInstance = void 0;
require("dotenv").config();
const redis_1 = require("@upstash/redis");
let REDIS_INSTANCE;
const getRedisInstance = () => {
    if (REDIS_INSTANCE) {
        return REDIS_INSTANCE;
    }
    REDIS_INSTANCE = new redis_1.Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return REDIS_INSTANCE;
};
exports.getRedisInstance = getRedisInstance;
