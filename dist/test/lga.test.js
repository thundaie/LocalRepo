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
const lga_1 = __importDefault(require("../model/lga"));
const userModel_1 = __importDefault(require("../model/userModel"));
jest.mock("../cache/cache");
jest.mock("../model/userModel");
jest.mock("../model/lga");
const MockedRegionModel = jest.mocked(lga_1.default);
const MockedUserModel = jest.mocked(userModel_1.default);
const mockGetRedisInstance = jest.mocked(cache_1.getRedisInstance);
const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();
beforeEach(() => {
    jest.resetAllMocks();
});
const dummyLga = [
    { "name": "Aba North", "state": "Abia" },
    { "name": "Aba South", "state": "Abia" },
    { "name": "Arochukwu", "state": "Abia" },
    { "name": "Bende", "state": "Abia" },
    { "name": "Ikwuano", "state": "Abia" },
    { "name": "Isiala Ngwa North", "state": "Abia" },
    { "name": "Isiala Ngwa South", "state": "Abia" },
    { "name": "Isuikwuato", "state": "Abia" },
    { "name": "Obi Ngwa", "state": "Abia" },
    { "name": "Ohafia", "state": "Abia" },
    { "name": "Osisioma", "state": "Abia" },
    { "name": "Ugwunagbo", "state": "Abia" },
    { "name": "Ukwa East", "state": "Abia" },
    { "name": "Ukwa West", "state": "Abia" },
    { "name": "Umuahia North", "state": "Abia" },
    { "name": "Umuahia South", "state": "Abia" },
    { "name": "Umu Nneochi", "state": "Abia" },
    { "name": "Demsa", "state": "Adamawa" },
    { "name": "Fufure", "state": "Adamawa" },
    { "name": "Ganye", "state": "Adamawa" },
    { "name": "Gayuk", "state": "Adamawa" },
    { "name": "Girei", "state": "Adamawa" },
    { "name": "Gombi", "state": "Adamawa" },
    { "name": "Hong", "state": "Adamawa" },
    { "name": "Jada", "state": "Adamawa" },
    { "name": "Lamurde", "state": "Adamawa" },
    { "name": "Madagali", "state": "Adamawa" }
];
describe("Lga endpoint", () => {
    test("unauthenticated users are not allowed access to get LocalGovernment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/localgov");
        expect(response.statusCode).toBe(401);
    }));
    test("LocalGovernment are fetched from cache when they have been previously requested", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, utils_1.generateToken)("user1");
        MockedUserModel.findOne.mockResolvedValue({ username: "user1" });
        MockedRegionModel.find.mockResolvedValue(dummyLga);
        // @ts-ignore
        mockGetRedisInstance.mockReturnValue({
            set: mockCacheSet,
            get: mockCacheGet
        });
        const response1 = yield (0, supertest_1.default)(app_1.default).get("/localgov").set({
            token
        });
        expect(response1.statusCode).toBe(200);
        expect(mockGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
        mockCacheGet.mockResolvedValue(dummyLga);
        const response2 = yield (0, supertest_1.default)(app_1.default).get("/localgov").set({
            token
        });
        expect(response2.statusCode).toBe(200);
        expect(mockGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheGet).toHaveBeenCalledTimes(2);
        // Make sure mockCacheSet was not called on the second request
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
    }));
    test("invalid tokens are rejected", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/localgov").set({
            token: "wrong-token"
        });
        expect(response.statusCode).toBe(401);
    }));
});
