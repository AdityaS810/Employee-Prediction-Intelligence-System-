function SectionCard({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`rounded-[26px] border border-white/10 bg-slate-950/40 p-5 ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-5">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{eyebrow}</p>
          ) : null}
          {title ? (
            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold text-white">
              {title}
            </h3>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}

export default SectionCard;
