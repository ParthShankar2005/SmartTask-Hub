const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const dbReadyMiddleware = require("../middleware/dbReadyMiddleware");

const router = express.Router();

router.use(dbReadyMiddleware);
router.use(authMiddleware);
router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
