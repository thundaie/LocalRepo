import express from "express";
const router = express.Router();
const { getRegions } = require("../controller/controller");

router.get("/", getRegions);

export default router;
