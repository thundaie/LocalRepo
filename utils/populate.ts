//Schemas
import Lga from "../model/lga";
import State from "../model/state";
import Region from "../model/region";

const data = require("./dump.json");

const stateMap = {};
const regionMap = {};

async function populateDatabase() {
  await Lga.collection.drop();
  await State.collection.drop();
  await Region.collection.drop();

  console.log("Dropped tables");

  // populate regions
  for (var regionData of data.regions) {
    const region = await Region.create({ name: regionData.name });
    regionMap[region.name] = region.id;
  }

  console.log("Imported regions!");

  // populate states
  for (var stateData of data.states) {
    const region = regionMap[stateData.region];

    const state = await State.create({ name: stateData.name, region: region });

    stateMap[state.name] = { id: state.id, region: region };
  }

  console.log("Imported states!");

  // populate lga
  for (var lgaData of data.lgas) {
    const state = stateMap[lgaData.state];

    await Lga.create({
      name: lgaData.name,
      state: state.id,
      region: state.region,
    });
  }

  console.log("Imported lgas!");
  console.log("DONE!!!!!!!!!!!!!!!!!!!!!!!");
}

export default populateDatabase;
