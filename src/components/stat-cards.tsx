export function StatCards({ items }: { items: { label: string; value: string | number }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="card-panel relative overflow-hidden border-l-[3px] border-l-brand p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] sm:p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-heading sm:mt-2">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
