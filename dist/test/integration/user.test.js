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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const testDb_1 = __importDefault(require("../../connect/testDb"));
const userModel_1 = __importDefault(require("../../model/userModel"));
beforeEach(() => {
    jest.resetAllMocks();
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield testDb_1.default.connect(); }));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield testDb_1.default.clear(); }));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield testDb_1.default.close(); }));
describe("user signup process", () => {
    test("should return a 200 if no user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/signup").send({
            username: "username1",
            email: "email1",
            password: "passwor1d",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Sign up complete, please authenticate your route access with this attached token");
        expect(response.body.token).toBeDefined();
    }));
    test("should return a 400 if user with same username already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = {
            username: "username1",
            email: "email@example.com",
            password: "some-random-hard-password"
        };
        yield (new userModel_1.default(existingUser)).save();
        // Now send a request trying to create user with same username
        const response = yield (0, supertest_1.default)(app_1.default).post("/signup").send({
            username: "username1",
            email: "emaiiling@example.com",
            password: "passwor1d",
        });
        expect(response.statusCode).toBe(400);
    }));
    // You can write other test cases here, no need to mock anything.
});
