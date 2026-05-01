const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task owner is required."],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      minlength: [1, "Task title cannot be empty."],
      maxlength: [120, "Task title must be 120 characters or fewer."],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Description must be 1000 characters or fewer."],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
