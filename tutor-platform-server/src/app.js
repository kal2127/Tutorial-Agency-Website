const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const { query } = require("./db/query");
const authenticate_routes = require("./modules/auth/auth.routes");
const path = require("path");
const bookingsRoutes = require("./modules/bookings/bookings.routes");
const tutorRoutes = require("./modules/tutors/tutors.routes");
const jobPostRoutes = require("./modules/job-posts/jobPosts.routes");

const app = express();

app.use(cors());
app.use(express.json());
// health check
app.get("/health", async (req, res, next) => {
  try {
    const rows = await query("SELECT 1 AS ok");
    res.json({ success: true, rows });
  } catch (e) {
    next(e);
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/family", bookingsRoutes);
app.use("/tutor", tutorRoutes);
app.use("/jobPost", jobPostRoutes);

app.use(errorHandler);
app.use("/auth", authenticate_routes);

module.exports = app;
