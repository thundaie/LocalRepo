import mongoose, { Schema } from "mongoose";


interface InterfaceLGA  {
  name: string;
  state: Schema.Types.ObjectId;
  region: Schema.Types.ObjectId;
}

const LGASchema: mongoose.Schema<InterfaceLGA> = new mongoose.Schema({
  name: {
    type: String,
  },
  state: {
    type: Schema.Types.ObjectId,
    ref: "States",
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: "Region",
  }
});

export default mongoose.model("LocalGovArea", LGASchema);
