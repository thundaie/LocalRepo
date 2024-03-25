import mongoose from "mongoose"

function connectDb(CONNECTION_URI: string): void{
    mongoose.connect(CONNECTION_URI)

    mongoose.connection.on("connected", () => {
        console.log("The database connection has been established")
    })

    mongoose.connection.on("error", (error) => {
        console.log(error)
    })
}


export default connectDb