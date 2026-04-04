const express = require("express");
const {
  addEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee
} = require("../controllers/hrController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("hr"));
router.get("/employees", listEmployees);
router.post("/add-employee", addEmployee);
router.put("/update-employee/:id", updateEmployee);
router.delete("/delete-employee/:id", deleteEmployee);

module.exports = router;
