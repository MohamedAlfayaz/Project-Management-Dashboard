const Task = require("../models/Task");


// CREATE TASK
const createTask = async (req, res) => {

  try {

    const task = await Task.create({
      title: req.body.title,

      description:
        req.body.description,

      projectId: req.body.projectId,

      employeeIds:
        req.body.employeeIds,

      eta: req.body.eta,

      status:
        req.body.status || "todo",

      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// GET ALL TASKS
const getTasks = async (req, res) => {

  try {

    const tasks = await Task.find()

      .populate(
        "projectId",
        "title"
      )

      .populate(
        "employeeIds",
        "name email image"
      )

      .sort({
        createdAt: 1,
      });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const getTaskById = async (
  req,
  res
) => {

  try {

    const task =
      await Task.findById(
        req.params.id
      )
        .populate(
          "projectId"
        )
        .populate(
          "employeeIds"
        );

    // NOT FOUND
    if (!task) {

      return res.status(404).json({

        message:
          "Task not found",

      });
    }

    // SUCCESS
    res.json(task);

  } catch (error) {

    res.status(500).json({

      message:
        error.message,

    });
  }
};



// UPDATE TASK
const updateTask = async (req, res) => {

  try {

    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.title = req.body.title;

    task.description =
      req.body.description;

    task.projectId =
      req.body.projectId;

    task.employeeIds =
      req.body.employeeIds;

    task.eta = req.body.eta;

    task.status = req.body.status;

    if (req.file) {

      task.image =
        `/uploads/${req.file.filename}`;
    }

    const updated =
      await task.save();

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



// DELETE TASK
const deleteTask = async (req, res) => {

  try {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Task deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};