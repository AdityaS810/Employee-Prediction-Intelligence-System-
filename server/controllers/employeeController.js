const Attendance = require("../models/Attendance");
const EmployeeProfile = require("../models/EmployeeProfile");
const Project = require("../models/Project");
const Performance = require("../models/Performance");
const User = require("../models/User");
const {
  calculateAttritionRisk,
  getAttendancePercentage,
  getProjectCompletionRate
} = require("../utils/risk");

async function getEmployeeBundle(userId) {
  const user = await User.findById(userId).select("-password");
  const profile = await EmployeeProfile.findOne({ userId });

  if (!user || !profile) {
    return null;
  }

  const attendance = await Attendance.find({ employeeId: profile.employeeId }).sort({
    date: -1
  });
  const projects = await Project.find({ employeeId: profile.employeeId }).sort({
    updatedAt: -1
  });
  const performance = await Performance.findOne({ employeeId: profile.employeeId });

  const attendancePercentage = getAttendancePercentage(attendance);
  const projectCompletionRate = getProjectCompletionRate(projects);
  const risk = calculateAttritionRisk({
    satisfactionScore: performance?.satisfactionScore || 0,
    attendancePercentage,
    projectCompletionRate
  });

  return {
    user,
    profile,
    attendance,
    projects,
    performance,
    metrics: {
      attendancePercentage,
      projectCompletionRate,
      attritionRisk: risk
    }
  };
}

async function getCurrentEmployee(req, res) {
  try {
    const data = await getEmployeeBundle(req.user._id);

    if (!data) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function markAttendance(req, res) {
  try {
    const profile = await EmployeeProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    const date = req.body.date ? new Date(req.body.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      {
        employeeId: profile.employeeId,
        date
      },
      {
        employeeId: profile.employeeId,
        date,
        status: req.body.status || "present"
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(201).json(attendance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAttendance(req, res) {
  try {
    let employeeId = req.query.employeeId;

    if (req.user.role === "employee") {
      const profile = await EmployeeProfile.findOne({ userId: req.user._id });
      employeeId = profile?.employeeId;
    }

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const attendance = await Attendance.find({ employeeId }).sort({ date: -1 });
    return res.json(attendance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getProjects(req, res) {
  try {
    let employeeId = req.query.employeeId;

    if (req.user.role === "employee") {
      const profile = await EmployeeProfile.findOne({ userId: req.user._id });
      employeeId = profile?.employeeId;
    }

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const projects = await Project.find({ employeeId }).sort({ updatedAt: -1 });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (req.user.role === "employee") {
      const profile = await EmployeeProfile.findOne({ userId: req.user._id });

      if (!profile || profile.employeeId !== project.employeeId) {
        return res.status(403).json({ message: "You cannot edit this project." });
      }
    }

    const completionPercentage =
      req.body.completionPercentage ?? project.completionPercentage;
    project.completionPercentage = completionPercentage;
    project.status =
      req.body.status || (completionPercentage >= 100 ? "completed" : "in-progress");
    project.title = req.body.title || project.title;

    await project.save();

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getCurrentEmployee,
  markAttendance,
  getAttendance,
  getProjects,
  updateProject,
  getEmployeeBundle
};
