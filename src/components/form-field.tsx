export function FormField({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (htmlFor) {
    return (
      <div className={`block text-sm ${className}`}>
        <label htmlFor={htmlFor} className="text-muted">
          {label}
        </label>
        {children}
      </div>
    );
  }

  return (
    <label className={`block text-sm ${className}`}>
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
