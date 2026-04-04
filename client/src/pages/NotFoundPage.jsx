import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">404</p>
        <h1 className="mt-3 font-['Space_Grotesk'] text-4xl font-semibold">Page not found</h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-400"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
