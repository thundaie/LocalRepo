import populateDatabase from "./populate";
import connectDb from "../connect/connect";
require("dotenv").config();


(async function () {
  connectDb(process.env.CONNECTION_URI as string);
  await populateDatabase();
})()

// You can do `ts-node utils/run-populate.ts`
// Separated out of the `populate.ts` file so we can re-use during test.