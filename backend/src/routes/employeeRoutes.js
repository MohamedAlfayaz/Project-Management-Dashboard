const express = require("express");

const router = express.Router();

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} = require(
  "../controllers/employeeController"
);

// GET
router.get(
  "/",
  getEmployees
);

router.get(
  "/:id",
  getEmployeeById
);

// CREATE
router.post(
  "/",
  upload.single("image"),
  createEmployee
);

// UPDATE
router.put(
  "/:id",
  upload.single("image"),
  updateEmployee
);

// DELETE
router.delete(
  "/:id",
  deleteEmployee
);

module.exports = router;