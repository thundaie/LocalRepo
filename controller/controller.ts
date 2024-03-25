import jwt from "jsonwebtoken"
require("dotenv").config();
import { Request, Response } from "express";

import State from "../model/state"
import Region from "../model/region"
import Lga from "../model/lga"
import userModel from "../model/userModel"
import { getRedisInstance } from "../cache/cache"

const DATA_EXPIRY_TIME = 1000;

async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  const bodyPayload = { username, email, password };

  if( (await userModel.find({username: username})).length){
    res.status(400).json({
      message: "Error, Username already exists"
    })
    return
  }

  try {
    const newUser = new userModel(bodyPayload);
    await newUser.save();
    const token = jwt.sign(
      { username: bodyPayload.username },
      process.env.JWT_SECRET as string
    );
    res.json({
      message: "Sign up complete, please authenticate your route access with this attached token",
      token
    });
  } catch (error) {
    res.status(500).json({
      messsage: "500, Error occured while trying to create User",
    });
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username: username });
    // console.log("user found")
    if (!user || !user.comparePassword(password)) {
      res.statusCode = 404
      res.json({
        message: "404, User not found"
      });
    }
    res.statusCode = 200 
    res.json({
      message: "Logged In successfully"
    })
  } catch (error) {
    console.log(error)
    res.statusCode = 500
    res.json({
      message: "An error occured while trying to log in"
    });
  }
}



async function getRegions(req: Request, res: Response): Promise<void>  {
  const name = req.query.name || "";
  const cacheKey = `regions#${name}`;
  const cache = getRedisInstance();

  const result = await cache.get(cacheKey);
  if (result) {
    res.status(200).json({ regions: result });
    return
  }

  let query = {};
  if (name) query["name"] = { $regex: name, $options: "i" };

  const regions = await Region.find(query);

  if (regions.length > 0) {
    // only write in cache when we actually have data to write
    await cache.set(cacheKey, regions, { ex: DATA_EXPIRY_TIME });
  }

  res.status(200).json({ regions: regions });
}


async function getStates(req: Request, res: Response): Promise<void> {
  const cache = getRedisInstance();

  let cacheKey = "states";

  const query = {}; // empty query which means to fetch all data

  if (req.query.region) {
    cacheKey += "#" + req.query.region; // this makes the cache key unique
    query["region"] = req.query.region; // finds all states with the same region id
  }

  if (req.query.name) {
    cacheKey += "#" + req.query.name; // this makes the cache key unique
    query["name"] = { $regex: req.query.name, $options: "i" }; // sets a regex query on the name field
  }

  const result = await cache.get(cacheKey); // fetch data from cache that match key
  if (result){
    res.status(200).json({ states: result })
    return
  }

  const states = await State.find(query).populate("region"); // populates the region field by fetching the data that matches the id from the database

  if (states.length > 0) {
    await cache.set(cacheKey, states, { ex: DATA_EXPIRY_TIME });
  }

  res.status(200).json({ states: states });
}

async function getLocalGovernment(req: Request, res: Response): Promise<void> {
  let cacheKey = "lgas";
  const cache = getRedisInstance();

  const query = {};

  if (req.query.name) {
    cacheKey += "#" + req.query.name;
    query["name"] = { $regex: req.query.name, $options: "i" };
  }

  if (req.query.region) {
    query["region"] = req.query.region;
    cacheKey += "#" + req.query.region;
  }

  if (req.query.state) {
    query["state"] = req.query.state;
    cacheKey += "#" + req.query.state;
  }

  const lgas = await Lga.find(query) // finds all lgas that match the query
    .populate("region") // populates the region field by fetching the data that matches the id from the database
    .populate("state", "-state.region"); // populates the state field by fetching the data that matches the id from the database, "-state.region" means to remove the region id from the fetched state data

  if (lgas.length > 0) {
    await cache.set(cacheKey, lgas, { ex: DATA_EXPIRY_TIME });
  }

  res.status(200).json({ lgas: lgas });
}



export {
  register,
  logIn,
  getRegions,
  getStates,
  getLocalGovernment,
};
