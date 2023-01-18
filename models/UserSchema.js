import mongoose from "mongoose";
const { Schema } = mongoose;

export const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type: String
    },
    language: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },



    file: String,
    ip: String,

}, { timestamps: true });

export const userModal = new mongoose.model('user', userSchema);