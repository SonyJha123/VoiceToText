import mongoose, {Schema} from "mongoose"
import cloudinary from "../helpers/cloudinary.js";

const collaboratorsSchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
      
    },
    phone: {
        type: String,
        required: true,
        unique: true, 
        validate: {
            validator: function(value) {
                return /^[0-9]{10}$/.test(value.toString());
            },
            message: props => `${props.value} is not a valid phone number!`
        }
     
    },
    password:{
        type:String,
        required:true
    },
    image: {
        type: String,
        required: false,
    },
    gender:{
        type:String,
      enum:["Male","Female"],
      required:true

    },
    profession:{
     type:String,
     required:true
        
    },
    date_of_birth:{
        type:Date,
        required:false
     },
     bio:{
        type: String,
        required:true
     },
     verified:{
        type:Boolean,
        default:false,
        required:true
     },
     token:{
       type: String 

     },
     otp:{
      type:Number
     },
     image_url:{
        type:String

     },
     about:{
        type:String,
        required:true

     }



    
}, {
    versionKey:false,
    timestamps: true
});


const collaboratorsModel = mongoose.model("Collaborators",collaboratorsSchema)
export default collaboratorsModel