import { Link } from "react-router-dom";

const features = [
  "JWT-based role authentication for HR and employees",
  "Persistent MongoDB records for profiles, projects, attendance, and performance",
  "Rule-based attrition scoring designed for future AI model upgrades",
  "Modern analytics dashboards with employee operations and HR oversight"
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(190,24,93,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(160deg,_#020617_0%,_#0f172a_40%,_#111827_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-['Space_Grotesk'] text-xl font-semibold">EPIS</p>
            <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">
              Employee Prediction Intelligence System
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/auth?mode=login"
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/auth?mode=register"
              className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-400"
            >
              Register
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-cyan-200/75">
              Retention Intelligence
            </p>
            <h1 className="mt-5 max-w-3xl font-['Space_Grotesk'] text-5xl font-semibold leading-tight md:text-7xl">
              Turn workforce signals into timely action.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              EPIS unifies employee operations, performance indicators, and attrition
              risk scoring into one production-ready portal for HR teams and employees.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/auth?mode=login"
                className="rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
              >
                Enter platform
              </Link>
              <Link
                to="/auth?mode=register"
                className="rounded-full border border-white/15 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Create employee account
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live view</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Attrition categories</p>
                  <p className="mt-3 font-['Space_Grotesk'] text-4xl font-semibold">3-tier</p>
                </div>
                <div className="rounded-3xl bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Access roles</p>
                  <p className="mt-3 font-['Space_Grotesk'] text-4xl font-semibold">HR + Employee</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-gradient-to-br from-rose-500/20 to-cyan-500/20 p-5">
                <p className="text-sm text-slate-200">Rule-based risk formula</p>
                <p className="mt-3 text-sm text-slate-300">
                  `(100 - satisfaction) + (100 - attendance) + (100 - project completion)`
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-12 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5 text-slate-200"
            >
              {feature}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
