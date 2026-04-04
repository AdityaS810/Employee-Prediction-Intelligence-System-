const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    promotionProbability: {
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

module.exports = mongoose.model("Performance", performanceSchema);
