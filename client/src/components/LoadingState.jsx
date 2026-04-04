function LoadingState({ label = "Loading workspace..." }) {
  return (
    <div className="flex items-center justify-center rounded-[26px] border border-white/10 bg-slate-950/40 px-6 py-16 text-center text-slate-300">
      {label}
    </div>
  );
}

export default LoadingState;
