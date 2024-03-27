import { createRequest, createResponse } from "node-mocks-http";
import UserModel from "../../model/userModel";
import { register } from "../../controller/controller";
import request from "supertest";
import app from "../../app";

jest.mock("../../model/userModel");

const MockedUserModel = jest.mocked(UserModel);

beforeEach(() => {
  jest.resetAllMocks();
})

describe("user signup process", () => {
  test("should save user if username does not already exist", async () => {
    const request = createRequest({
      body: {
        username: "username1",
        email: "email1",
        password: "passwor1d",
      }
    })
    
    const response = createResponse();
    
    MockedUserModel.find.mockResolvedValue([]);
    
    const mockSave = jest.fn();
    
    // @ts-ignore
    MockedUserModel.mockImplementation(() => ({
      save: mockSave,
    }));
    
    // This is the function we want to test
    await register(request, response)
    
    expect(MockedUserModel.find.mock.calls.length).toBe(1);
    expect(mockSave.mock.calls.length).toBe(1);
  })
  
  test("should not save user again if user already exists", async () => {
    const existingUser = {
      username: "username1",
      email: "email@example.com",
      password: "some-random-hard-password"
    }
    
    // Create the request with same user but duplicate username
    const request = createRequest({
      body: {
        username: "username1",
        email: "email@example.com",
        password: "some-random-hard-password"
      }
    })
    
    const response = createResponse();
    
    MockedUserModel.find.mockResolvedValue([ existingUser ]);
    
    // We should not get to this point
    const mockSave = jest.fn();
    
    // @ts-ignore
    MockedUserModel.mockImplementation(() => ({
      save: mockSave,
    }));
    
    await register(request, response)
    
    expect(MockedUserModel.find.mock.calls.length).toBe(1);
    expect(mockSave.mock.calls.length).toBe(0);
  })
})