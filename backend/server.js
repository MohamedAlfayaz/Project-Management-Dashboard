const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./src/config/db");

dotenv.config();

connectDB();

const app = express();


// CORS
/* ------------------ MIDDLEWARE ------------------ */

// CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: ${origin} not allowed`)
      );
    },
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json());


// STATIC UPLOADS
app.use(
  "/uploads",
  express.static("uploads")
);


// ROUTES
app.use(
  "/api/projects",
  require("./src/routes/projectRoutes")
);

app.use(
  "/api/employees",
  require("./src/routes/employeeRoutes")
);

app.use(
  "/api/tasks",
  require("./src/routes/taskRoutes")
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});