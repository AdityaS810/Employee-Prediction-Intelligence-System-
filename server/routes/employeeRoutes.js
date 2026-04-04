const express = require("express");
const {
  getAttendance,
  getCurrentEmployee,
  getProjects,
  markAttendance,
  updateProject
} = require("../controllers/employeeController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/employee/me", protect, authorize("employee"), getCurrentEmployee);
router.post("/attendance/mark", protect, authorize("employee"), markAttendance);
router.get("/attendance", protect, authorize("employee", "hr"), getAttendance);
router.get("/projects", protect, authorize("employee", "hr"), getProjects);
router.put("/projects/:id", protect, authorize("employee", "hr"), updateProject);

module.exports = router;
