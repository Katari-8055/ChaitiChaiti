import mongoose from "mongoose";
const connetDB = async () => {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }
    try {
        await mongoose.connect(url, {
            dbName: "Chatappmicroserviceapp",
        });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
};
export default connetDB;
//# sourceMappingURL=DB.js.map