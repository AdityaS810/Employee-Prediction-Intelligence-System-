import { useEffect, useState } from "react";
import api from "../api/client";
import AppShell from "../components/AppShell";
import LoadingState from "../components/LoadingState";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProjectId, setSavingProjectId] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: dashboardData } = await api.get("/employee/me");
      setData(dashboardData);
      const { data: performanceData } = await api.get(
        `/performance/${dashboardData.profile.employeeId}`
      );
      setPerformance(performanceData);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const markAttendance = async () => {
    setAttendanceLoading(true);

    try {
      await api.post("/attendance/mark", { status: "present" });
      await loadDashboard();
    } finally {
      setAttendanceLoading(false);
    }
  };

  const updateProject = async (projectId, completionPercentage, title) => {
    setSavingProjectId(projectId);

    try {
      await api.put(`/projects/${projectId}`, {
        title,
        completionPercentage,
        status: completionPercentage >= 100 ? "completed" : "in-progress"
      });
      await loadDashboard();
    } finally {
      setSavingProjectId("");
    }
  };

  const links = [{ label: "Employee dashboard", to: "/employee" }];

  if (loading) {
    return (
      <AppShell
        title="Employee Dashboard"
        subtitle="Your personal EPIS workspace for attendance, projects, and growth."
        links={links}
      >
        <LoadingState />
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell
        title="Employee Dashboard"
        subtitle="Your personal EPIS workspace for attendance, projects, and growth."
        links={links}
      >
        <LoadingState label={error || "No employee data available."} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Employee Dashboard"
      subtitle="Track your records, keep attendance current, and understand your performance indicators."
      links={links}
      actions={
        <button
          type="button"
          onClick={markAttendance}
          disabled={attendanceLoading}
          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {attendanceLoading ? "Marking..." : "Mark attendance"}
        </button>
      }
    >
      {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance"
          value={`${data.metrics.attendancePercentage}%`}
          hint="Presence ratio across recorded workdays."
          tone="emerald"
        />
        <StatCard
          label="Project completion"
          value={`${data.metrics.projectCompletionRate}%`}
          hint="Average completion across assigned projects."
          tone="cyan"
        />
        <StatCard
          label="Satisfaction"
          value={`${performance?.performance?.satisfactionScore || 0}%`}
          hint="Pulse score tracked by the performance record."
          tone="amber"
        />
        <StatCard
          label="Attrition risk"
          value={performance?.attritionRisk?.category || "Low"}
          hint={`Risk score ${performance?.attritionRisk?.score || 0}`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Profile" eyebrow="Employee record">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-1 text-lg font-semibold">{data.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Employee ID</p>
              <p className="mt-1 text-lg font-semibold">{data.profile.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Department</p>
              <p className="mt-1 text-lg font-semibold">{data.profile.department}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Designation</p>
              <p className="mt-1 text-lg font-semibold">{data.profile.designation}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Date of joining</p>
              <p className="mt-1 text-lg font-semibold">
                {new Date(data.profile.dateOfJoining).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-1 text-lg font-semibold">{user.email}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Performance" eyebrow="Growth indicators">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Rating</p>
              <p className="mt-3 font-['Space_Grotesk'] text-4xl font-semibold">
                {performance?.performance?.rating?.toFixed(1) || "0.0"}
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Promotion probability</p>
              <p className="mt-3 font-['Space_Grotesk'] text-4xl font-semibold">
                {performance?.performance?.promotionProbability || 0}%
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-white/5 p-4">
            <p className="text-sm text-slate-400">Risk formula output</p>
            <p className="mt-2 text-base text-slate-200">
              {performance?.attritionRisk?.category} risk with score{" "}
              {performance?.attritionRisk?.score || 0}
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Projects" eyebrow="Update progress">
          <div className="space-y-4">
            {data.projects.length ? (
              data.projects.map((project) => (
                <ProjectEditor
                  key={project._id}
                  project={project}
                  saving={savingProjectId === project._id}
                  onSave={updateProject}
                />
              ))
            ) : (
              <p className="text-slate-400">No projects assigned yet.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Recent attendance" eyebrow="Recorded days">
          <div className="space-y-3">
            {data.attendance.length ? (
              data.attendance.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.status === "present"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Attendance will appear after your first mark.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

function ProjectEditor({ project, onSave, saving }) {
  const [completion, setCompletion] = useState(project.completionPercentage);
  const [title, setTitle] = useState(project.title);

  useEffect(() => {
    setCompletion(project.completionPercentage);
    setTitle(project.title);
  }, [project.completionPercentage, project.title]);

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Project title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Completion %</span>
          <input
            value={completion}
            min="0"
            max="100"
            type="number"
            onChange={(event) => setCompletion(Number(event.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">Status: {project.status}</p>
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(project._id, completion, title)}
          className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
