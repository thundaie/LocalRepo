import request from "supertest";
import app from "../app";

import UserModel from "../model/userModel";

jest.mock("../model/userModel");

const MockedUserModel = jest.mocked(UserModel);

beforeEach(() => {
    jest.resetAllMocks();
})

describe("user signup process", () => {
  test("should return a 200 if no user already exists", async () => {
    MockedUserModel.find.mockResolvedValue([]);

    const mockSave = jest.fn();

    // @ts-ignore
    MockedUserModel.mockImplementation(() => ({
      save: mockSave,
    }));

    const response = await request(app).post("/signup").send({
      username: "username1",
      email: "email1",
      password: "passwor1d",
    });

    expect(response.statusCode).toBe(200);
    
    expect(MockedUserModel.find.mock.calls.length).toBe(1);
    expect(mockSave.mock.calls.length).toBe(1);

    expect(response.body.message).toBe("Sign up complete, please authenticate your route access with this attached token");
    expect(response.body.token).toBeDefined();
  });

  test("should return a 400 if user with same username already exists", async () => {
    const existingUser = {
        username: "username1",
        email: "email@example.com",
        password: "some-random-hard-password"
    }
    MockedUserModel.find.mockResolvedValue([existingUser]);

    // We should not get to this point
    const mockSave = jest.fn();

    // @ts-ignore
    MockedUserModel.mockImplementation(() => ({
      save: mockSave,
    }));

    const response = await request(app).post("/signup").send({
      username: "username1",
      email: "emaiiling@example.com",
      password: "passwor1d",
    });

    expect(response.statusCode).toBe(400);
    expect(MockedUserModel.find.mock.calls.length).toBe(1);
    expect(mockSave.mock.calls.length).toBe(0);
  });

  test("should return a 500 if saving the model fails", async () => {
    MockedUserModel.find.mockResolvedValue([]);
    // We should not get to this point
    const mockSave = jest.fn();

    // @ts-ignore
    MockedUserModel.mockImplementation(() => ({
      save: mockSave,
    }));

    mockSave.mockImplementation(() => {
        throw new Error("Could not save")
    })

    const response = await request(app).post("/signup").send({
      username: "username1",
      email: "emaiiling@example.com",
      password: "passwor1d",
    });

    expect(response.statusCode).toBe(500);
    expect(MockedUserModel.find.mock.calls.length).toBe(1);
    expect(mockSave.mock.calls.length).toBe(1);
  });

});



// describe("existing Username", () => {
//     test("throw error", async() => {
//         const response = await request(app).post("/signup").send({
//         username: "thundaie",
//         email: "email",
//        password: "incorrect"
//          })

//          let yout: object = {message: "Error, Username already exists"}

//          (userModel.find as jest.Mock).mockResolvedValue(yout)

//          expect(response.body).toStrictEqual(yout)

//     })
// })

//     describe("user login", () => {
//         describe("if the username and password are valid", () => {
//             test("should login in and return message", async() => {
//                 const response = await request(app).post("/signin").send({
//                     username: "thundaie",
//                     password: "incorrect"
//                 })
//                 expect(response.body).toStrictEqual({message: "Logged In successfully"})
//             })
//         })
//     })

//     describe("if user is not found", () => {
//         test("should return 404 and message", async () => {
//             const response = await request(app).post("/signin").send({
//                 username: "thdaie",
//                 password: "incorrt"
//             })
//             expect(response.body).toStrictEqual({message: "404, User not found"})
//         })
//     })

//     describe("Error during the login process", () => {
//         test("if login is unsuccessful", async () => {
//             // app.mockResolvedValueOnce({message: "An error occured while trying to log in"})
//             myMock.mockReturnValue({message: "An error occured while trying to log in"})
//             const response = await request(app).post("/signin").send({
//                 username: "thundaie",
//                 password: "incorrect"
//         })
//         expect(response.body).toStrictEqual({message: "An error occured while trying to log in"})
//         expect(response.statusCode).toBe(500)
//     })
// })

// describe("error signing up", () => {
//     test("incase a server error occurs during creation", async() => {
//         const response = await request(app).post("/signup").send({
//             username: "122",
//             email: "emal",
//             password: "rrect"
//         })
//         expect(response.status).toBe(200)
//         expect(response.body).toStrictEqual({messsage: "500, Error occured while trying to create User"})
//     })
// })

describe("apiUse", () => {
  describe("regions", () => {
    // test("if user is unauthenticated", async () => {
    //     const user = await request(app).get("/regions").send({
    //         headers: {
    //             "token": ""
    //         }
    //     })
    //     expect(user.status).toBe(403)
    // })
    // test("if user is authenticated", async () => {
    //     const response = await request(app).get("/regions").send({
    //         headers: {
    //             "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNsYXBzbGFwIiwiaWF0IjoxNzEwNTI1OTczfQ.MqXakcGikIOTRqCJpTca_0CQEou_CPAVsJBy3CW0yp8"
    //         }
    //     })
    //     expect(response.status).toBe(200)
    // })
    // test("Regions are returned from the cache if available", () => {
    // })
    // test("Regions are filtered by name if a name is provided in the query", () => {
    // })
    // describe("states", () => {
    //     test("if user is unauthenticated", async () => {
    //         const user = await request(app).get("/states").send({
    //             headers: {
    //                 "token": ""
    //             }
    //         })
    //         expect(user.status).toBe(403)
    //     })
    //     test("if user is authenticated", async () => {
    //         const response = await request(app).get("/states").send({
    //             headers: {
    //                 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNsYXBzbGFwIiwiaWF0IjoxNzEwNTI1OTczfQ.MqXakcGikIOTRqCJpTca_0CQEou_CPAVsJBy3CW0yp8"
    //             }
    //         })
    //         expect(response.status).toBe(200)
    //     })
    //     test("States are returned from the cache if available", async () => {
    //         const checkCache = `#regions`
    //         const result = await cache.get(checkCache)
    //         if(result > 0){
    //         const response = await request(app).get("/states")
    //         expect(response.body).toBe(result)
    //     }
    //     })
    //     test("States are filtered by name if a name is provided in the query", async () => {
    //         const response = await request(app).get("/states?name=lagos")
    //         const state = (<Array<any>>response.body).find(obj => obj.name === "South West")
    //         expect(response.body).toStrictEqual({
    //             object from Db
    //         })
    //     })
    //     test("States and region is returned when both query parameters are provided", () => {
    //     })
    // })
    // describe("lga", () => {
    //     test("if user is unauthenticated", async () => {
    //         const user = await request(app).get("/localgov").send({
    //             headers: {
    //                 "token": ""
    //             }
    //         })
    //         expect(user.status).toBe(403)
    //     })
    //     test("if user is authenticated", async () => {
    //         const response = await request(app).get("/localgov").send({
    //             headers: {
    //                 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNsYXBzbGFwIiwiaWF0IjoxNzEwNTI1OTczfQ.MqXakcGikIOTRqCJpTca_0CQEou_CPAVsJBy3CW0yp8"
    //             }
    //         })
    //         expect(response.status).toBe(200)
    //     })
    //     test("Lgas are returned from the cache if available", () => {
    //         const cacheKey =
    //     })
    //     test("Lgas are filtered by name if a name is provided in the query", () => {
    //     })
    //     test("Lga, States and region is returned when both query parameters are provided", () => {
    //     })
    //     test("if the findAll returns properly", () => {
    //     })
    // })
    // check that the south west region is present in what's returned
    // const southWest = (<Array<any>>response.body).find(obj => obj.name === "South West")
    //     expect(response.body).toStrictEqual([
    //         {
    //             name: "South West",
    //             _id:
    //         }
    //     ])
    // })
    // describe("if user is authenticated", () => {
    //     describe("should return a 200", async() => {
    //         const user = await request(app).get("region", "state", "lga").send({
    //             query: apiKey
    //         })
    //         expect(user.status).toBe(200)
    //     })
    // })
  });
});

//Search Tests
// dont know how to go about this tests
// ideas:
// 1. test search for regions and state without LGA
// 2. test search for states and LGA without region
// 3. return all

// describe("search", () => {
//     describe("find regions and states without LGAs", async () => {
//         const regionState = await request(app).get("/region?name=&state=").send({
//             name: "",
//             state: ""
//         })
//         expect(regionState.json).toBe()
//     })

//     describe("find states and LGA without regiobs", async () => {
//         const stateLga = await request(app).get("/state?name=&lgas=").send({
//             name: "",
//             lga: ""
//         })
//         expect(stateLga.json).toBe()
//     })

//     describe("find All", async () => {
//         const threeDimesion = await request(app).get("/lgas?name=&state=&region=").send({
//             name: "",
//             state: "",
//             region: ""
//         })
//         expect(threeDimesion.json).toBe()
//     })
// })
