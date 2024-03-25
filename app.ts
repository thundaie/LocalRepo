import express from "express";
const app = express();
  import helmet from "helmet";
  import cors from "cors";
  import { xss } from "express-xss-sanitizer";
  import limiter from "express-rate-limit";
  require("dotenv").config();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//New
import signIn from "./routes/login"
import signUp from "./routes/signup";
import authenticate from "./middleware/auth";
import Region from "./routes/region"
import State from "./routes/state"
import Lga from "./routes/lga"

//Rate Limiter
const rateLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

//Middlewares
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(rateLimiter);

//Routes
app.use("/signin", signIn);
app.use("/signup", signUp);
app.use("/regions", authenticate, Region);
app.use("/states", authenticate, State);
app.use("/localgov", authenticate, Lga);



export default app