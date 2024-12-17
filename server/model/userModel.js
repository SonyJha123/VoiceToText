import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
        unique: true, 
     
    },
    email: {
        type: String,
        required: true,
        unique: true,
      
    },
    password:{
        type: String,
        required: true,
    },
    access_token: {
        type: String,
    },
    image_url:{
        type:String

     }
}, {
    versionKey:false,
    timestamps: true
});


const userModel = mongoose.model("user",userSchema)
export default userModel