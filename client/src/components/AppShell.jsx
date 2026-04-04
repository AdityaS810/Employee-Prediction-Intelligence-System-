import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppShell({ title, subtitle, links, actions, children }) {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(190,24,93,0.2),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur lg:flex">
          <div>
            <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.35em] text-rose-200/80">
              EPIS Workspace
            </p>
            <h1 className="mt-4 font-['Space_Grotesk'] text-3xl font-semibold">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "bg-white/0 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Signed In
            </p>
            <p className="mt-2 text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-rose-200/80">
                  Intelligence Layer
                </p>
                <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold">
                  {title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">{actions}</div>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
