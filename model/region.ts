import mongoose from "mongoose"

interface InterfaceRegion{
    name: string
}

const regionSchema: mongoose.Schema<InterfaceRegion> = new mongoose.Schema({
    name: {
        type: String
    }
    })



export default mongoose.model("Region", regionSchema)