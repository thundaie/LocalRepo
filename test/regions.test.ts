import { getRedisInstance } from "../cache/cache";
import request from "supertest";
import { generateToken } from "./utils";
import app from "../app";
import RegionModel from "../model/region";
import UserModel from "../model/userModel";

jest.mock("../cache/cache");
jest.mock("../model/userModel");
jest.mock("../model/region");

const MockedRegionModel = jest.mocked(RegionModel);
const MockedUserModel = jest.mocked(UserModel);
const mockGetRedisInstance = jest.mocked(getRedisInstance);

const mockCacheGet = jest.fn()
const mockCacheSet = jest.fn()

const dummyRegions = [
  { _id: "idone", name: "North Central" },
  { _id: "idtwo", name: "North East" },
  { _id: "idthree", name: "North West" },
  { _id: "idfour", name: "South East" },
  { _id: "idfive", name: "South West" },
  { _id: "idsix", name: "South South" },
];

describe("regions endpoint", () => {
  test("unauthenticated users are not allowed access to get regions", async () => {
    const response = await request(app).get("/regions");
    expect(response.statusCode).toBe(401);
  });

  test("regions are fetched from cache when they have been previously requested", async () => {
    const token = generateToken("user1");
    
    MockedUserModel.findOne.mockResolvedValue({username: "user1"});
    MockedRegionModel.find.mockResolvedValue(dummyRegions);

    // @ts-ignore
    mockGetRedisInstance.mockReturnValue({
        set: mockCacheSet,
        get: mockCacheGet
    })

    const response1 = await request(app).get("/regions").set({
        token
    });

    expect(response1.statusCode).toBe(200);
    expect(mockGetRedisInstance).toHaveBeenCalled();
    expect(mockCacheSet).toHaveBeenCalledTimes(1);
    expect(mockCacheGet).toHaveBeenCalledTimes(1);


    mockCacheGet.mockResolvedValue(dummyRegions)
    const response2 = await request(app).get("/regions").set({
        token
    });

    expect(response2.statusCode).toBe(200);
    expect(mockGetRedisInstance).toHaveBeenCalled();
    expect(mockCacheGet).toHaveBeenCalledTimes(2);
    // Make sure mockCacheSet was not called on the second request
    expect(mockCacheSet).toHaveBeenCalledTimes(1);

  });

  test("invalid tokens are rejected", async () => {
    const response = await request(app).get("/regions").set({
        token: "wrong-token"
    });
    expect(response.statusCode).toBe(401);
  })
});
