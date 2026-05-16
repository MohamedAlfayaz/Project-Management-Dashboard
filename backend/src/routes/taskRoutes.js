const express = require("express");

const router = express.Router();

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require(
  "../controllers/taskController"
);


// CREATE
router.post(
  "/",
  upload.single("image"),
  createTask
);


// GET
router.get("/", getTasks);

router.get("/:id", getTaskById);

// UPDATE
router.put(
  "/:id",
  upload.single("image"),
  updateTask
);


// DELETE
router.delete("/:id", deleteTask);

module.exports = router;