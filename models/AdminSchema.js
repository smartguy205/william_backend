import mongoose from "mongoose";
const {Schema} = mongoose;

export const AdminSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

export const adminModal = new mongoose.model('admin', AdminSchema);