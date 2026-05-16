const Employee = require("../models/Employee");


// ==========================
// CREATE
// ==========================

const createEmployee = async (
  req,
  res
) => {

  try {

    const {
      name,
      position,
      email,
    } = req.body;

    // VALIDATION
    if (
      !name ||
      !position ||
      !email
    ) {

      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    // EMAIL EXISTS
    const exists =
      await Employee.findOne({
        email,
      });

    if (exists) {

      return res.status(400).json({
        message:
          "Email already exists",
      });
    }

    // CREATE
    const employee =
      await Employee.create({

        name,
        position,
        email,

        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",

      });

    res.status(201).json(
      employee
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// GET ALL
// ==========================

const getEmployees = async (
  req,
  res
) => {

  try {

    const employees =
      await Employee.find().sort({
        createdAt: 1,
      });

    res.json(employees);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE EMPLOYEE
const getEmployeeById = async (
  req,
  res
) => {

  try {

    const employee =
      await Employee.findById(
        req.params.id
      );

    if (!employee) {

      return res.status(404).json({
        message:
          "Employee not found",
      });
    }

    res.json(employee);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// UPDATE
// ==========================

const updateEmployee = async (
  req,
  res
) => {

  try {

    const employee =
      await Employee.findById(
        req.params.id
      );

    if (!employee) {

      return res.status(404).json({
        message:
          "Employee not found",
      });
    }

    // EMAIL EXISTS CHECK
    const exists =
      await Employee.findOne({
        email: req.body.email,
        _id: {
          $ne: req.params.id,
        },
      });

    if (exists) {

      return res.status(400).json({
        message:
          "Email already exists",
      });
    }

    employee.name =
      req.body.name;

    employee.position =
      req.body.position;

    employee.email =
      req.body.email;

    // IMAGE
    if (req.file) {

      employee.image =
        `/uploads/${req.file.filename}`;
    }

    const updated =
      await employee.save();

    res.json(updated);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================
// DELETE
// ==========================

const deleteEmployee = async (
  req,
  res
) => {

  try {

    const employee =
      await Employee.findByIdAndDelete(
        req.params.id
      );

    if (!employee) {

      return res.status(404).json({
        message:
          "Employee not found",
      });
    }

    res.json({
      message:
        "Employee deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
};