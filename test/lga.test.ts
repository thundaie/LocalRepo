import { getRedisInstance } from "../cache/cache";
import request from "supertest";
import { generateToken } from "./utils";
import app from "../app";
import LgaModel from "../model/lga";
import UserModel from "../model/userModel";

jest.mock("../cache/cache");
jest.mock("../model/userModel");
jest.mock("../model/lga");

const MockedRegionModel = jest.mocked(LgaModel);
const MockedUserModel = jest.mocked(UserModel);
const mockGetRedisInstance = jest.mocked(getRedisInstance);

const mockCacheGet = jest.fn()
const mockCacheSet = jest.fn()

beforeEach(() => {
    jest.resetAllMocks();
})

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
]

describe("Lga endpoint", () => {
  test("unauthenticated users are not allowed access to get LocalGovernment", async () => {
    const response = await request(app).get("/localgov");
    expect(response.statusCode).toBe(401);
  });

  test("LocalGovernment are fetched from cache when they have been previously requested", async () => {
    const token = generateToken("user1");
    
    MockedUserModel.findOne.mockResolvedValue({username: "user1"});
    MockedRegionModel.find.mockResolvedValue(dummyLga);

    // @ts-ignore
    mockGetRedisInstance.mockReturnValue({
        set: mockCacheSet,
        get: mockCacheGet
    })

    const response1 = await request(app).get("/localgov").set({
        token
    });

    expect(response1.statusCode).toBe(200);
    expect(mockGetRedisInstance).toHaveBeenCalled();
    expect(mockCacheSet).toHaveBeenCalledTimes(1);
    expect(mockCacheGet).toHaveBeenCalledTimes(1);


    mockCacheGet.mockResolvedValue(dummyLga)
    const response2 = await request(app).get("/localgov").set({
        token
    });

    expect(response2.statusCode).toBe(200);
    expect(mockGetRedisInstance).toHaveBeenCalled();
    expect(mockCacheGet).toHaveBeenCalledTimes(2);
    // Make sure mockCacheSet was not called on the second request
    expect(mockCacheSet).toHaveBeenCalledTimes(1);

  });

  test("invalid tokens are rejected", async () => {
    const response = await request(app).get("/localgov").set({
        token: "wrong-token"
    });
    expect(response.statusCode).toBe(401);
  })
});
