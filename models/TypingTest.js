import mongoose, { Schema } from 'mongoose';

const TestSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    wpm: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    testID: {
        type: String,
        required: true
    },
    testType: {
        type: Number,
        default: 0
    },
},
    { timestamps: true }
);

export const typingTest = new mongoose.model("typingTest", TestSchema);