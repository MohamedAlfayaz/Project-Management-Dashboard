const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
} = require("../controllers/projectController");

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

module.exports = router;