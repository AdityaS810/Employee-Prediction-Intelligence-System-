const Attendance = require("../models/Attendance");
const EmployeeProfile = require("../models/EmployeeProfile");
const Performance = require("../models/Performance");
const Project = require("../models/Project");
const {
  calculateAttritionRisk,
  getAttendancePercentage,
  getProjectCompletionRate
} = require("../utils/risk");

async function getPerformance(req, res) {
  try {
    const { employeeId } = req.params;

    if (req.user.role === "employee") {
      const profile = await EmployeeProfile.findOne({ userId: req.user._id });

      if (!profile || profile.employeeId !== employeeId) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    const [performance, attendance, projects] = await Promise.all([
      Performance.findOne({ employeeId }),
      Attendance.find({ employeeId }),
      Project.find({ employeeId })
    ]);

    if (!performance) {
      return res.status(404).json({ message: "Performance record not found." });
    }

    const attendancePercentage = getAttendancePercentage(attendance);
    const projectCompletionRate = getProjectCompletionRate(projects);

    return res.json({
      performance,
      attendancePercentage,
      projectCompletionRate,
      attritionRisk: calculateAttritionRisk({
        satisfactionScore: performance.satisfactionScore,
        attendancePercentage,
        projectCompletionRate
      })
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function predict(req, res) {
  try {
    const { satisfactionScore = 0, attendancePercentage = 0, projectCompletionRate = 0 } =
      req.body;

    return res.json({
      model: "rule-based-placeholder",
      ...calculateAttritionRisk({
        satisfactionScore,
        attendancePercentage,
        projectCompletionRate
      })
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getPerformance,
  predict
};
