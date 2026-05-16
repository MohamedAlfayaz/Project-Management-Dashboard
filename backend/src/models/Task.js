const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    eta: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "todo",
        "inprogress",
        "needtest",
        "completed",
        "reopen"
      ],
      default: "todo",
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Task",
  taskSchema
);