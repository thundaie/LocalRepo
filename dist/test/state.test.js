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
const cache_1 = require("../cache/cache");
const supertest_1 = __importDefault(require("supertest"));
const utils_1 = require("./utils");
const app_1 = __importDefault(require("../app"));
const state_1 = __importDefault(require("../model/state"));
const userModel_1 = __importDefault(require("../model/userModel"));
jest.mock("../model/state");
jest.mock("../model/userModel");
jest.mock("../cache/cache");
const MockedStateModel = jest.mocked(state_1.default);
const MockedUserModel = jest.mocked(userModel_1.default);
const MockedGetRedisInstance = jest.mocked(cache_1.getRedisInstance);
const mockCacheSet = jest.fn();
const mockCacheGet = jest.fn();
beforeEach(() => {
    jest.resetAllMocks();
});
const dummyStates = [
    { "name": "Benue", "region": "182735" },
    { "name": "Kogi", "region": "182735" },
    { "name": "Kwara", "region": "182735" },
    { "name": "Nasarawa", "region": "182735" },
    { "name": "Niger", "region": "182735" },
    { "name": "Plateau", "region": "028363" },
    { "name": "Federal Capital Territory", "region": "028363" },
    { "name": "Adamawa", "region": "028363" },
    { "name": "Bauchi", "region": "028363" },
    { "name": "Borno", "region": "028363" },
    { "name": "Gombe", "region": "028363" },
    { "name": "Taraba", "region": "028363" },
];
describe("state end point test", () => {
    test("throw error if an authenticated person tries to access the route", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/states");
        expect(response.statusCode).toBe(401);
    }));
    test("when user is aunthenticated route access is granted", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, utils_1.generateToken)("user1");
        MockedUserModel.findOne.mockResolvedValue({ username: "user1" });
        MockedStateModel.find.mockResolvedValue(dummyStates.filter(state => state.region === "028363"));
        // @ts-ignore
        MockedGetRedisInstance.mockReturnValue({
            set: mockCacheSet,
            get: mockCacheGet
        });
        const response1 = yield (0, supertest_1.default)(app_1.default).get("/regions?name=Gombe&region=028363").set({
            token
        });
        expect(response1.statusCode).toBe(200);
        expect(MockedGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        mockCacheGet.mockResolvedValue(dummyStates.filter(state => state.region === "028363"));
        const response2 = yield (0, supertest_1.default)(app_1.default).get("/regions").set({
            token
        });
        expect(response2.statusCode).toBe(200);
        expect(MockedGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheGet).toHaveBeenCalledTimes(2);
        // Make sure mockCacheSet was not called on the second request
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
    }));
    test("invalid tokens are rejected", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/states").set({
            token: "wrong-token"
        });
        expect(response.statusCode).toBe(401);
    }));
});
