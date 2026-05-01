const Task = require("../models/Task");
const mongoose = require("mongoose");

const getTasks = async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.status(200).json(tasks);
};

const createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Title is required." });
  }

  const task = await Task.create({ title, description, status, dueDate });
  return res.status(201).json(task);
};

const updateTask = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Update payload is required." });
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json(task);
};

const deleteTask = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json({ message: "Task deleted successfully." });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
