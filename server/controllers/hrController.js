const bcrypt = require("bcryptjs");
const Attendance = require("../models/Attendance");
const EmployeeProfile = require("../models/EmployeeProfile");
const Performance = require("../models/Performance");
const Project = require("../models/Project");
const User = require("../models/User");
const {
  calculateAttritionRisk,
  getAttendancePercentage,
  getProjectCompletionRate
} = require("../utils/risk");

async function listEmployees(req, res) {
  try {
    const profiles = await EmployeeProfile.find().sort({ createdAt: -1 }).lean();
    const employeeIds = profiles.map((profile) => profile.employeeId);
    const userIds = profiles.map((profile) => profile.userId);

    const [users, performances, attendances, projects] = await Promise.all([
      User.find({ _id: { $in: userIds } }).select("-password").lean(),
      Performance.find({ employeeId: { $in: employeeIds } }).lean(),
      Attendance.find({ employeeId: { $in: employeeIds } }).lean(),
      Project.find({ employeeId: { $in: employeeIds } }).lean()
    ]);

    const usersById = new Map(users.map((user) => [String(user._id), user]));
    const performanceByEmployeeId = new Map(
      performances.map((item) => [item.employeeId, item])
    );

    const attendanceByEmployeeId = attendances.reduce((acc, record) => {
      acc[record.employeeId] = acc[record.employeeId] || [];
      acc[record.employeeId].push(record);
      return acc;
    }, {});

    const projectsByEmployeeId = projects.reduce((acc, project) => {
      acc[project.employeeId] = acc[project.employeeId] || [];
      acc[project.employeeId].push(project);
      return acc;
    }, {});

    const employees = profiles
      .map((profile) => {
        const user = usersById.get(String(profile.userId));
        if (!user || user.role !== "employee") {
          return null;
        }
        const performance = performanceByEmployeeId.get(profile.employeeId) || null;
        const attendance = attendanceByEmployeeId[profile.employeeId] || [];
        const employeeProjects = projectsByEmployeeId[profile.employeeId] || [];
        const attendancePercentage = getAttendancePercentage(attendance);
        const projectCompletionRate = getProjectCompletionRate(employeeProjects);
        const attritionRisk = calculateAttritionRisk({
          satisfactionScore: performance?.satisfactionScore || 0,
          attendancePercentage,
          projectCompletionRate
        });

        return {
          user,
          profile,
          performance,
          attendancePercentage,
          projectCompletionRate,
          attritionRisk,
          projectCount: employeeProjects.length
        };
      })
      .filter(Boolean);

    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function addEmployee(req, res) {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      department,
      designation,
      dateOfJoining,
      personalDetails,
      performance,
      projects
    } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const [existingUser, existingProfile] = await Promise.all([
      User.findOne({ email: email.toLowerCase() }),
      EmployeeProfile.findOne({ employeeId })
    ]);

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    if (existingProfile) {
      return res.status(409).json({ message: "Employee ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "employee"
    });

    const profile = await EmployeeProfile.create({
      userId: user._id,
      employeeId,
      department,
      designation,
      dateOfJoining,
      personalDetails
    });

    const performanceRecord = await Performance.create({
      employeeId,
      rating: performance?.rating ?? 3,
      satisfactionScore: performance?.satisfactionScore ?? 70,
      promotionProbability: performance?.promotionProbability ?? 40
    });

    if (Array.isArray(projects) && projects.length) {
      await Project.insertMany(
        projects.map((project) => ({
          employeeId,
          title: project.title,
          status:
            project.status ||
            ((project.completionPercentage || 0) >= 100 ? "completed" : "in-progress"),
          completionPercentage: project.completionPercentage || 0
        }))
      );
    }

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile,
      performance: performanceRecord
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateEmployee(req, res) {
  try {
    const profile = await EmployeeProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    const user = await User.findById(profile.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const {
      name,
      email,
      password,
      department,
      designation,
      dateOfJoining,
      personalDetails,
      performance
    } = req.body;

    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists." });
      }
      user.email = email.toLowerCase();
    }

    user.name = name || user.name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();

    profile.department = department || profile.department;
    profile.designation = designation || profile.designation;
    profile.dateOfJoining = dateOfJoining || profile.dateOfJoining;
    profile.personalDetails = {
      ...profile.personalDetails,
      ...(personalDetails || {})
    };
    await profile.save();

    const performanceRecord = await Performance.findOneAndUpdate(
      { employeeId: profile.employeeId },
      {
        $set: {
          ...(performance || {})
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile,
      performance: performanceRecord
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteEmployee(req, res) {
  try {
    const profile = await EmployeeProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    await Promise.all([
      User.findByIdAndDelete(profile.userId),
      Performance.findOneAndDelete({ employeeId: profile.employeeId }),
      Attendance.deleteMany({ employeeId: profile.employeeId }),
      Project.deleteMany({ employeeId: profile.employeeId }),
      EmployeeProfile.findByIdAndDelete(req.params.id)
    ]);

    return res.json({ message: "Employee deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  listEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
