export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header border-b border-[var(--border)] pb-4 sm:pb-5">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-lead">{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions shrink-0">{actions}</div> : null}
    </header>
  );
}

export function PageSection({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`page-section ${className}`}>
      {title ? <h2 className="section-heading">{title}</h2> : null}
      {children}
    </section>
  );
}
