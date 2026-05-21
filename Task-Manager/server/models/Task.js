const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
{
    title: { type: String, required: true },
    description: { type: String },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: ["Todo", "In Progress", "Completed"],
        default: "Todo"
    },

    dueDate: { type: Date },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);