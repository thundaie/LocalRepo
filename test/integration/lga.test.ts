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