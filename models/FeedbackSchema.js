import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedBackSchema = new Schema({
    name:{
        type:String
    },
    text: {
        type: String,
    },
    userID: {
        type: String,
    },

});

export const feedbackModal = new mongoose.model('feedbackInfo', FeedBackSchema);