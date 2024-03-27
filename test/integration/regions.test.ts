import db from "../../connect/testDb";
import populateDatabase from "../../utils/populate";
import request from "supertest";
import app from "../../app";
import { createUser, generateToken } from "../utils";

beforeEach(async () => {
  await populateDatabase();
  jest.resetAllMocks();
})

beforeAll(async () => {
  await db.connect();
});
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("test the regions endpoints", () => {
  test("returns a 200 with the list of regions", async () => {
    const token = await createUser("user1", "user@example.com", "password1234");
    const response = await request(app).get("/regions").set({
      token
    })
    expect(response.statusCode).toBe(200);
    // Based on the length of the regions we populated in the beforeEach hook, we expect 6
    expect(response.body.regions.length).toBe(6);
  })
  
  
  // Write other tests here
});
