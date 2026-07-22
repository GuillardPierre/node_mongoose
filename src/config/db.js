import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connecté");
    return conn;
  } catch (error) {
    console.error("Erreur" + error.message);
  }
};

export default connectDB;
