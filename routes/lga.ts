import express from "express";
const router = express.Router();
import { getLocalGovernment } from "../controller/controller";

router.get("/", getLocalGovernment);

export default router;
