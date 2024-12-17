import mongoose, {Schema} from "mongoose";

const userQuerySchema = new Schema({
    userQuery: {
        type:String,
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'user' },

    },{
    versionKey:false,
    timestamps: true
});


const userQueryModel = mongoose.model("userQuery",userQuerySchema)
export default userQueryModel