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
  { _id: "idone", name: "North Central" },
  { _id: "idtwo", name: "North East" },
  { _id: "idthree", name: "North West" },
  { _id: "idfour", name: "South East" },
  { _id: "idfive", name: "South West" },
  { _id: "idsix", name: "South South" },
];

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
