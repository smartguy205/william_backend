import mongoose, { Schema } from 'mongoose';

const CreatedTestSchema = new Schema({
    country: { type: String },
    position: { type: String },
    test_type: { type: Number },
    language: { type: String, default: "uk" }
});

export const createdTestModel = new mongoose.model("create_jobs", CreatedTestSchema);