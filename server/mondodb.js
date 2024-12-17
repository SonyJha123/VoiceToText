import mongoose from "mongoose"
  
  const connectdb = async (req, res) => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/Voice-Contact")

        console.log("Database connected successfully");
        
    } catch (error) {
        return res.status(400).json({message:" database not connected**"})
    }
  }

  export default connectdb;