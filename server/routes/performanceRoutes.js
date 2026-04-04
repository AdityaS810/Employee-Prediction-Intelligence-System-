const express = require("express");
const {
  getPerformance,
  predict
} = require("../controllers/performanceController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/performance/:employeeId", protect, authorize("employee", "hr"), getPerformance);
router.post("/predict", protect, authorize("employee", "hr"), predict);

module.exports = router;
