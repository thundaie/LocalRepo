import express from "express";
const router = express.Router();
import { getStates } from "../controller/controller";

router.get("/", getStates);

export default router;
