import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const registerInitialState = {
  name: "",
  email: "",
  password: "",
  employeeId: "",
  department: "",
  designation: "",
  dateOfJoining: "",
  phone: "",
  address: ""
};

function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("employee");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState(registerInitialState);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register, loading, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(user.role === "hr" ? "/hr" : "/employee", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const signedIn = await login({ ...loginData, role });
      navigate(signedIn.role === "hr" ? "/hr" : "/employee", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login.");
    }
  };

  const onRegister = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        employeeId: registerData.employeeId,
        department: registerData.department,
        designation: registerData.designation,
        dateOfJoining: registerData.dateOfJoining,
        personalDetails: {
          phone: registerData.phone,
          address: registerData.address
        }
      };
      await register(payload);
      navigate("/employee", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to register.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(190,24,93,0.25),_transparent_28%),linear-gradient(160deg,_#020617_0%,_#111827_100%)] px-4 py-8 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <Link to="/" className="text-sm text-rose-200/80 transition hover:text-rose-100">
            Back to landing
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.35em] text-slate-400">
            EPIS Access
          </p>
          <h1 className="mt-3 font-['Space_Grotesk'] text-5xl font-semibold">
            {mode === "login" ? "Sign into your workspace" : "Create an employee account"}
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Secure role-based access for HR administrators and employees, backed by a real
            Node, Express, and MongoDB API.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Authentication</p>
              <p className="mt-3 text-xl font-semibold">JWT + bcrypt</p>
            </div>
            <div className="rounded-[28px] bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Persistence</p>
              <p className="mt-3 text-xl font-semibold">MongoDB records</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-8 shadow-2xl backdrop-blur">
          <div className="flex gap-3 rounded-full bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                mode === "login" ? "bg-rose-500 text-white" : "text-slate-300"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                mode === "register" ? "bg-rose-500 text-white" : "text-slate-300"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" ? (
            <form className="mt-8 space-y-5" onSubmit={onLogin}>
              <div className="flex gap-3 rounded-full bg-white/5 p-1">
                {["employee", "hr"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`flex-1 rounded-full px-4 py-3 text-sm capitalize transition ${
                      role === item ? "bg-white text-slate-950" : "text-slate-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <input
                  value={loginData.email}
                  onChange={(event) =>
                    setLoginData((current) => ({ ...current, email: event.target.value }))
                  }
                  type="email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-rose-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
                <input
                  value={loginData.password}
                  onChange={(event) =>
                    setLoginData((current) => ({ ...current, password: event.target.value }))
                  }
                  type="password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-rose-400"
                />
              </label>

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-rose-500 px-4 py-3 font-medium text-white transition hover:bg-rose-400 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={onRegister}>
              {[
                ["name", "Full name", "text"],
                ["email", "Email", "email"],
                ["password", "Password", "password"],
                ["employeeId", "Employee ID", "text"],
                ["department", "Department", "text"],
                ["designation", "Designation", "text"],
                ["dateOfJoining", "Date of joining", "date"],
                ["phone", "Phone", "text"],
                ["address", "Address", "text"]
              ].map(([field, label, type]) => (
                <label key={field} className={field === "address" ? "block md:col-span-2" : "block"}>
                  <span className="mb-2 block text-sm text-slate-300">{label}</span>
                  <input
                    value={registerData[field]}
                    onChange={(event) =>
                      setRegisterData((current) => ({
                        ...current,
                        [field]: event.target.value
                      }))
                    }
                    type={type}
                    required={["name", "email", "password", "employeeId"].includes(field)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400"
                  />
                </label>
              ))}

              {error ? <p className="text-sm text-rose-300 md:col-span-2">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60 md:col-span-2"
              >
                {loading ? "Creating account..." : "Register and continue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
