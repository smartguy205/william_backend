import mongoose, { Schema } from 'mongoose';

const TestSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }
);

export const typingTest = new mongoose.model("typingTest", TestSchema);