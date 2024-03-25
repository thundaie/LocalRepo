import mongoose, { Schema } from "mongoose";

interface InterfaceState  {
  name: string;
  region: Schema.Types.ObjectId;
}


const stateSchema: mongoose.Schema<InterfaceState> = new mongoose.Schema({
  name: {
    type: String,
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: "Region"
  },
});

export default mongoose.model("States", stateSchema);
