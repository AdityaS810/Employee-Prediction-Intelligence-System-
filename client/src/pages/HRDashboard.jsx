import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "../api/client";
import AppShell from "../components/AppShell";
import LoadingState from "../components/LoadingState";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";

const employeeInitialState = {
  name: "",
  email: "",
  password: "",
  employeeId: "",
  department: "",
  designation: "",
  dateOfJoining: "",
  rating: 3,
  satisfactionScore: 70,
  promotionProbability: 40,
  projectTitle: "",
  projectCompletion: 0
};

function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState(employeeInitialState);
  const [editingProfileId, setEditingProfileId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/hr/employees");
      setEmployees(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0].profile.employeeId);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return employees;
    }

    return employees.filter((item) => {
      const values = [
        item.user?.name,
        item.user?.email,
        item.profile?.employeeId,
        item.profile?.department
      ];

      return values.some((value) => value?.toLowerCase().includes(query));
    });
  }, [employees, search]);

  const selectedEmployee = useMemo(
    () => employees.find((item) => item.profile.employeeId === selectedId) || filteredEmployees[0],
    [employees, filteredEmployees, selectedId]
  );

  const overview = useMemo(() => {
    const total = employees.length;
    const highRisk = employees.filter((item) => item.attritionRisk.category === "High").length;
    const averageSatisfaction =
      total === 0
        ? 0
        : Math.round(
            employees.reduce(
              (sum, item) => sum + (item.performance?.satisfactionScore || 0),
              0
            ) / total
          );
    const averageAttendance =
      total === 0
        ? 0
        : Math.round(
            employees.reduce((sum, item) => sum + item.attendancePercentage, 0) / total
          );

    return { total, highRisk, averageSatisfaction, averageAttendance };
  }, [employees]);

  const chartData = useMemo(
    () =>
      employees.map((item) => ({
        name: item.user?.name?.split(" ")[0] || item.profile.employeeId,
        riskScore: item.attritionRisk.score,
        satisfaction: item.performance?.satisfactionScore || 0,
        attendance: item.attendancePercentage
      })),
    [employees]
  );

  const startCreate = () => {
    setEditingProfileId("");
    setFormData(employeeInitialState);
  };

  const startEdit = () => {
    if (!selectedEmployee) {
      return;
    }

    setEditingProfileId(selectedEmployee.profile._id);
    setFormData({
      name: selectedEmployee.user?.name || "",
      email: selectedEmployee.user?.email || "",
      password: "",
      employeeId: selectedEmployee.profile?.employeeId || "",
      department: selectedEmployee.profile?.department || "",
      designation: selectedEmployee.profile?.designation || "",
      dateOfJoining: selectedEmployee.profile?.dateOfJoining?.slice(0, 10) || "",
      rating: selectedEmployee.performance?.rating || 3,
      satisfactionScore: selectedEmployee.performance?.satisfactionScore || 70,
      promotionProbability: selectedEmployee.performance?.promotionProbability || 40,
      projectTitle: "",
      projectCompletion: 0
    });
  };

  const submitEmployee = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      employeeId: formData.employeeId,
      department: formData.department,
      designation: formData.designation,
      dateOfJoining: formData.dateOfJoining,
      performance: {
        rating: Number(formData.rating),
        satisfactionScore: Number(formData.satisfactionScore),
        promotionProbability: Number(formData.promotionProbability)
      },
      projects: formData.projectTitle
        ? [
            {
              title: formData.projectTitle,
              completionPercentage: Number(formData.projectCompletion)
            }
          ]
        : []
    };

    try {
      if (editingProfileId) {
        await api.put(`/hr/update-employee/${editingProfileId}`, payload);
      } else {
        await api.post("/hr/add-employee", payload);
      }

      await loadEmployees();
      startCreate();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save employee.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEmployee = async () => {
    if (!selectedEmployee) {
      return;
    }

    setSaving(true);
    try {
      await api.delete(`/hr/delete-employee/${selectedEmployee.profile._id}`);
      await loadEmployees();
      setSelectedId("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete employee.");
    } finally {
      setSaving(false);
    }
  };

  const links = [{ label: "HR dashboard", to: "/hr" }];

  if (loading) {
    return (
      <AppShell
        title="HR Dashboard"
        subtitle="Manage employees, track workforce health, and monitor attrition signals."
        links={links}
      >
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="HR Dashboard"
      subtitle="Manage employee records, evaluate performance trends, and surface attrition risk across the organization."
      links={links}
      actions={
        <>
          <button
            type="button"
            onClick={startCreate}
            className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            New employee
          </button>
          <button
            type="button"
            onClick={startEdit}
            disabled={!selectedEmployee}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
          >
            Edit selected
          </button>
        </>
      }
    >
      {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Employees"
          value={overview.total}
          hint="Active employee profiles in the system."
          tone="cyan"
        />
        <StatCard
          label="High risk"
          value={overview.highRisk}
          hint="Employees currently in the high attrition band."
        />
        <StatCard
          label="Avg satisfaction"
          value={`${overview.averageSatisfaction}%`}
          hint="Average satisfaction score across performance records."
          tone="amber"
        />
        <StatCard
          label="Avg attendance"
          value={`${overview.averageAttendance}%`}
          hint="Attendance consistency across tracked workdays."
          tone="emerald"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Employee directory" eyebrow="Search and review">
          <div className="mb-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, ID, or department"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </div>
          <div className="overflow-hidden rounded-[24px] border border-white/10">
            <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr] bg-white/5 px-4 py-3 text-sm text-slate-400">
              <span>Employee</span>
              <span>Department</span>
              <span>Attendance</span>
              <span>Risk</span>
            </div>
            <div className="max-h-[420px] overflow-auto">
              {filteredEmployees.map((item) => (
                <button
                  type="button"
                  key={item.profile._id}
                  onClick={() => setSelectedId(item.profile.employeeId)}
                  className={`grid w-full grid-cols-[1.2fr_1fr_0.8fr_0.8fr] px-4 py-4 text-left transition ${
                    selectedEmployee?.profile._id === item.profile._id
                      ? "bg-rose-500/15"
                      : "border-t border-white/5 hover:bg-white/5"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-white">{item.user?.name}</span>
                    <span className="text-sm text-slate-400">{item.profile.employeeId}</span>
                  </span>
                  <span className="text-slate-300">{item.profile.department}</span>
                  <span className="text-slate-300">{item.attendancePercentage}%</span>
                  <span
                    className={`text-sm font-medium ${
                      item.attritionRisk.category === "High"
                        ? "text-rose-300"
                        : item.attritionRisk.category === "Medium"
                        ? "text-amber-300"
                        : "text-emerald-300"
                    }`}
                  >
                    {item.attritionRisk.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title={editingProfileId ? "Update employee" : "Add employee"} eyebrow="CRUD operations">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submitEmployee}>
            {[
              ["name", "Full name", "text"],
              ["email", "Email", "email"],
              ["password", editingProfileId ? "New password (optional)" : "Password", "password"],
              ["employeeId", "Employee ID", "text"],
              ["department", "Department", "text"],
              ["designation", "Designation", "text"],
              ["dateOfJoining", "Date of joining", "date"],
              ["rating", "Rating", "number"],
              ["satisfactionScore", "Satisfaction score", "number"],
              ["promotionProbability", "Promotion probability", "number"],
              ["projectTitle", "Initial project title", "text"],
              ["projectCompletion", "Initial project completion", "number"]
            ].map(([field, label, type]) => (
              <label key={field} className="block">
                <span className="mb-2 block text-sm text-slate-300">{label}</span>
                <input
                  type={type}
                  required={!editingProfileId && ["name", "email", "password", "employeeId"].includes(field)}
                  value={formData[field]}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, [field]: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                />
              </label>
            ))}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-medium transition hover:bg-rose-400 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingProfileId ? "Update employee" : "Add employee"}
              </button>
              <button
                type="button"
                onClick={startCreate}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Clear form
              </button>
            </div>
          </form>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Performance dashboard" eyebrow="Attrition analytics">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px"
                  }}
                />
                <Bar dataKey="riskScore" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="satisfaction" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                <Bar dataKey="attendance" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Selected employee" eyebrow="Detailed view">
          {selectedEmployee ? (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">Employee</p>
                <h3 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold">
                  {selectedEmployee.user?.name}
                </h3>
                <p className="mt-1 text-slate-300">
                  {selectedEmployee.profile.designation} • {selectedEmployee.profile.department}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Attendance</p>
                  <p className="mt-3 text-3xl font-semibold">
                    {selectedEmployee.attendancePercentage}%
                  </p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Project completion</p>
                  <p className="mt-3 text-3xl font-semibold">
                    {selectedEmployee.projectCompletionRate}%
                  </p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Rating</p>
                  <p className="mt-3 text-3xl font-semibold">
                    {selectedEmployee.performance?.rating?.toFixed(1) || "0.0"}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Risk</p>
                  <p className="mt-3 text-3xl font-semibold">
                    {selectedEmployee.attritionRisk.category}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Score {selectedEmployee.attritionRisk.score}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={deleteEmployee}
                className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-60"
              >
                Delete selected employee
              </button>
            </div>
          ) : (
            <p className="text-slate-400">Select an employee to inspect details.</p>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}

export default HRDashboard;
