const StatCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="cc-stat-card rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-5">
    <div className="flex min-h-9 items-center justify-between gap-3">
      <p className="text-sm font-medium text-[var(--cc-muted)]">{title}</p>
      {Icon && (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--cc-raised)] text-[var(--cc-accent)]">
          <Icon size={18} aria-hidden="true" />
        </span>
      )}
    </div>
    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--cc-ink)]">{value}</h3>
    {subtitle && <p className="mt-2 text-sm text-[var(--cc-muted)]">{subtitle}</p>}
  </div>
);

export default StatCard;
