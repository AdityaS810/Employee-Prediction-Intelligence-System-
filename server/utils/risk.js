function getAttendancePercentage(attendanceRecords) {
  if (!attendanceRecords.length) {
    return 0;
  }

  const presentDays = attendanceRecords.filter(
    (record) => record.status === "present"
  ).length;

  return Math.round((presentDays / attendanceRecords.length) * 100);
}

function getProjectCompletionRate(projects) {
  if (!projects.length) {
    return 0;
  }

  const totalCompletion = projects.reduce(
    (sum, project) => sum + (project.completionPercentage || 0),
    0
  );

  return Math.round(totalCompletion / projects.length);
}

function getRiskCategory(score) {
  if (score <= 100) {
    return "Low";
  }

  if (score <= 200) {
    return "Medium";
  }

  return "High";
}

function calculateAttritionRisk({
  satisfactionScore = 0,
  attendancePercentage = 0,
  projectCompletionRate = 0
}) {
  const score =
    (100 - satisfactionScore) +
    (100 - attendancePercentage) +
    (100 - projectCompletionRate);

  return {
    score,
    category: getRiskCategory(score)
  };
}

module.exports = {
  getAttendancePercentage,
  getProjectCompletionRate,
  calculateAttritionRisk
};
