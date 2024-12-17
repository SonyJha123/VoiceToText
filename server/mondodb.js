import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectdb;
