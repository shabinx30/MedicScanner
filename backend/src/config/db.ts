import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const { MONGODB_URL } = process.env
        if(!MONGODB_URL) {
            console.log("can't find mongodb url")
            return 
        }

        await mongoose.connect(MONGODB_URL as string)
        console.log("db connected")
    } catch (error) {
        console.log("could not connect to db")
    }
}
