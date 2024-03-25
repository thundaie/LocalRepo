import mongoose from "mongoose";

import bcrypt from "bcryptjs"

interface InterfaceUser  {
    username: string;
    email: string;
    password: string;
  }

interface UserMethods {
    comparePassword(password: string): Promise<boolean>
}

type UserModel = mongoose.Model<InterfaceUser, {}, UserMethods>

const userModel: mongoose.Schema<InterfaceUser, UserModel, UserMethods> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Choose your unique username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Provide your email address"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Provide your password"]
    }
})




userModel.pre("save", async function(next: CallableFunction): Promise<void>{
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userModel.method("comparePassword", async function(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password)
})



export default mongoose.model<InterfaceUser, UserModel>("users", userModel)
