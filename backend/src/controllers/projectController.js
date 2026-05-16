const Project = require("../models/Project");


// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: 1,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PROJECT
const getProjectById = async (
  req,
  res
) => {

  try {

    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {

      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    res.json(project);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};