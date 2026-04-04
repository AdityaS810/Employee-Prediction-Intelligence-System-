const mongoose = require("mongoose");

const employeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    department: {
      type: String,
      default: "Unassigned"
    },
    designation: {
      type: String,
      default: "Associate"
    },
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    personalDetails: {
      phone: String,
      address: String,
      age: Number,
      gender: String,
      emergencyContact: String,
      skills: [String]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("EmployeeProfile", employeeProfileSchema);
