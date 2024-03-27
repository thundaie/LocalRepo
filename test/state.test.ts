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
]



describe("state end point test", () => {
    test("throw error if an authenticated person tries to access the route", async() => {
        const response = await request(app).get("/states")
        expect(response.statusCode).toBe(401)
    })


    test("when user is aunthenticated route access is granted", async() => {
        const token = generateToken("user1");
    
        MockedUserModel.findOne.mockResolvedValue({username: "user1"});
        MockedStateModel.find.mockResolvedValue(dummyStates.filter(state => state.region === "028363"));

        
    
        // @ts-ignore
        MockedGetRedisInstance.mockReturnValue({
            set: mockCacheSet,
            get: mockCacheGet
        })

    

        
    
        const response1 = await request(app).get("/regions?name=Gombe&region=028363").set({
            token
        });
    
        expect(response1.statusCode).toBe(200);
        expect(MockedGetRedisInstance).toHaveBeenCalled();
        expect(mockCacheSet).toHaveBeenCalledTimes(1);
        expect(mockCacheGet).toHaveBeenCalledTimes(1);
    
    
        mockCacheGet.mockResolvedValue(dummyStates.filter(state => state.region === "028363"))
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


