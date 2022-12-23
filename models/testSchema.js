import mongoose, { Schema } from 'mongoose';

const TestSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    questionsAttempted: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    averageTime: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    Questions: {
        type: [],
        required: true
    },
    userQuestionsAndAnswers: {
        type: [],
    },
    retest: {
        type: Number,
        default: 0
    },
    isTestCompleted: {
        type: Boolean,
        default: false
    },
    isTestStarted: {
        type: Boolean,
        default: false
    },
    isSentToSlack: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

export const testModel = new mongoose.model("test", TestSchema);