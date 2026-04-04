const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress"
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);
