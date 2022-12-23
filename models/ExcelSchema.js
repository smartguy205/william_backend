import mongoose from "mongoose";
const {Schema} = mongoose;

const excelSchema = new Schema({
    Question:{
        type:String,
        required:true
    },
    Options:{
        type:[String],
        required:true
    },
    Images:{
        type:[String]
    },
    Solution:{
        type:String,
        required:true
    },
    Answer:{
        type:String,
        required:true
    },
    type:{
        type:Number,
    }
});


export const excelModal = new mongoose.model('Question_Paper', excelSchema);