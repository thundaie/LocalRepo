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
const testDb_1 = __importDefault(require("../../connect/testDb"));
const populate_1 = __importDefault(require("../../utils/populate"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const utils_1 = require("../utils");
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, populate_1.default)();
    jest.resetAllMocks();
}));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb_1.default.connect();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield testDb_1.default.clear(); }));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield testDb_1.default.close(); }));
describe("test the regions endpoints", () => {
    test("returns a 200 with the list of regions", () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield (0, utils_1.createUser)("user1", "user@example.com", "password1234");
        const response = yield (0, supertest_1.default)(app_1.default).get("/regions").set({
            token
        });
        expect(response.statusCode).toBe(200);
        // Based on the length of the regions we populated in the beforeEach hook, we expect 6
        expect(response.body.regions.length).toBe(6);
    }));
    // Write other tests here
});
