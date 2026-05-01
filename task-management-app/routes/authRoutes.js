const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const dbReadyMiddleware = require("../middleware/dbReadyMiddleware");

const router = express.Router();

router.use(dbReadyMiddleware);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
