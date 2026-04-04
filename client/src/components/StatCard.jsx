function StatCard({ label, value, hint, tone = "rose" }) {
  const tones = {
    rose: "from-rose-500/30 to-orange-400/10",
    cyan: "from-cyan-500/30 to-sky-400/10",
    emerald: "from-emerald-500/30 to-lime-400/10",
    amber: "from-amber-500/30 to-orange-500/10"
  };

  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${tones[tone]} p-5 shadow-lg shadow-slate-950/30`}
    >
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-4 font-['Space_Grotesk'] text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </div>
  );
}

export default StatCard;
