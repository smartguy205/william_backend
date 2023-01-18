import mongoose, { Schema } from 'mongoose';

const positionSchema = new Schema({
    position: { type: String },
    position_code: { type: String },
});

export const positionModel = new mongoose.model("position", positionSchema);