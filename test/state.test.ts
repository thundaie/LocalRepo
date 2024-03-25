import { getRedisInstance } from "../cache/cache";
import request from "supertest";
import { generateToken } from "./utils";
import app from "../app";
import StateModel from "../model/state";
import UserModel from "../model/userModel";

jest.mock("../model/state")
jest.mock("../model/userModel")
jest.mock("../cache/cache")

const MockedStateModel = jest.mocked(StateModel)
const MockedUserModel = jest.mocked(UserModel)
const MockedGetRedisInstance = jest.mocked(getRedisInstance)

const mockCacheSet = jest.fn()
const mockCacheGet =jest.fn()


beforeEach(() => {
    jest.resetAllMocks();
})

const id = "North East"

const dummyStates = [
    { "name": "Benue", "region": id },
    { "name": "Kogi", "region": id },
    { "name": "Kwara", "region": id },
    { "name": "Nasarawa", "region": id },
    { "name": "Niger", "region": id },
    { "name": "Plateau", "region": id },
    { "name": "Federal Capital Territory", "region": id },
    { "name": "Adamawa", "region": id },
    { "name": "Bauchi", "region": id },
    { "name": "Borno", "region": id },
    { "name": "Gombe", "region": id },
    { "name": "Taraba", "region": id },
]



describe("state end point test", () => {
    test("throw error if an authenticated person tries to access the route", async() => {
        const response = await request(app).get("/states")
        expect(response.statusCode).toBe(401)
    })


    test("when user is aunthenticated route access is granted", async() => {
        const token = generateToken("user1");
    
        MockedUserModel.findOne.mockResolvedValue({username: "user1"});
        MockedStateModel.find.mockResolvedValue(dummyStates);
        MockedStateModel.populate.mockName(id)
        
    
        // @ts-ignore
        MockedGetRedisInstance.mockReturnValue({
            set: mockCacheSet,
            get: mockCacheGet
        })

    

        
    
        const response1 = await request(app).get("/regions").set({
            token
        });
    
        expect(response1.statusCode).toBe(200);
        expect(MockedGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
    
    
        mockCacheGet.mockResolvedValue(dummyStates)
        const response2 = await request(app).get("/regions").set({
            token
        });
    
        expect(response2.statusCode).toBe(200);
        expect(MockedGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheGet).toHaveBeenCalledTimes(2);
        // Make sure mockCacheSet was not called on the second request
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
    
      });

  test("invalid tokens are rejected", async () => {
    const response = await request(app).get("/states").set({
        token: "wrong-token"
    });
    expect(response.statusCode).toBe(401);
  })
})


