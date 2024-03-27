"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Schemas
const lga_1 = __importDefault(require("../model/lga"));
const state_1 = __importDefault(require("../model/state"));
const region_1 = __importDefault(require("../model/region"));
const data = require("./dump.json");
const stateMap = {};
const regionMap = {};
function populateDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield lga_1.default.collection.drop();
        yield state_1.default.collection.drop();
        yield region_1.default.collection.drop();
        console.log("Dropped tables");
        // populate regions
        for (var regionData of data.regions) {
            const region = yield region_1.default.create({ name: regionData.name });
            regionMap[region.name] = region.id;
        }
        console.log("Imported regions!");
        // populate states
        for (var stateData of data.states) {
            const region = regionMap[stateData.region];
            const state = yield state_1.default.create({ name: stateData.name, region: region });
            stateMap[state.name] = { id: state.id, region: region };
        }
        console.log("Imported states!");
        // populate lga
        for (var lgaData of data.lgas) {
            const state = stateMap[lgaData.state];
            yield lga_1.default.create({
                name: lgaData.name,
                state: state.id,
                region: state.region,
            });
        }
        console.log("Imported lgas!");
        console.log("DONE!!!!!!!!!!!!!!!!!!!!!!!");
    });
}
exports.default = populateDatabase;
