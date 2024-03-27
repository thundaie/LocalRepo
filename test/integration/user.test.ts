import request from "supertest";
import app from "../../app";
import db from "../../connect/testDb";
import UserModel from "../../model/userModel";

beforeEach(() => {
  jest.resetAllMocks();
})

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("user signup process", () => {
  test("should return a 200 if no user already exists", async () => {
    const response = await request(app).post("/signup").send({
      username: "username1",
      email: "email1",
      password: "passwor1d",
    });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Sign up complete, please authenticate your route access with this attached token");
    expect(response.body.token).toBeDefined();
  });
  
  test("should return a 400 if user with same username already exists", async () => {
    const existingUser = {
      username: "username1",
      email: "email@example.com",
      password: "some-random-hard-password"
    }
    await (new UserModel(existingUser)).save();
    
    // Now send a request trying to create user with same username
    const response = await request(app).post("/signup").send({
      username: "username1",
      email: "emaiiling@example.com",
      password: "passwor1d",
    });
    
    expect(response.statusCode).toBe(400);
  });
  
  // You can write other test cases here, no need to mock anything.
  
});
