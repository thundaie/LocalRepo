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
const node_mocks_http_1 = require("node-mocks-http");
const userModel_1 = __importDefault(require("../../model/userModel"));
const controller_1 = require("../../controller/controller");
jest.mock("../../model/userModel");
const MockedUserModel = jest.mocked(userModel_1.default);
beforeEach(() => {
    jest.resetAllMocks();
});
describe("user signup process", () => {
    test("should save user if username does not already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, node_mocks_http_1.createRequest)({
            body: {
                username: "username1",
                email: "email1",
                password: "passwor1d",
            }
        });
        const response = (0, node_mocks_http_1.createResponse)();
        MockedUserModel.find.mockResolvedValue([]);
        const mockSave = jest.fn();
        // @ts-ignore
        MockedUserModel.mockImplementation(() => ({
            save: mockSave,
        }));
        // This is the function we want to test
        yield (0, controller_1.register)(request, response);
        expect(MockedUserModel.find.mock.calls.length).toBe(1);
        expect(mockSave.mock.calls.length).toBe(1);
    }));
    test("should not save user again if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = {
            username: "username1",
            email: "email@example.com",
            password: "some-random-hard-password"
        };
        // Create the request with same user but duplicate username
        const request = (0, node_mocks_http_1.createRequest)({
            body: {
                username: "username1",
                email: "email@example.com",
                password: "some-random-hard-password"
            }
        });
        const response = (0, node_mocks_http_1.createResponse)();
        MockedUserModel.find.mockResolvedValue([existingUser]);
        // We should not get to this point
        const mockSave = jest.fn();
        // @ts-ignore
        MockedUserModel.mockImplementation(() => ({
            save: mockSave,
        }));
        yield (0, controller_1.register)(request, response);
        expect(MockedUserModel.find.mock.calls.length).toBe(1);
        expect(mockSave.mock.calls.length).toBe(0);
    }));
});
