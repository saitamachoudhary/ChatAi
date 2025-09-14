import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    createDate:{
        type:Date,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    task:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum: ["low", "normal", "high"], default: "normal"
    },
    priority:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model("task",taskSchema)