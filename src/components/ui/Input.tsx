import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = {
  label?: string;
  description?: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, description, icon, rightAction, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-slate-200 tracking-wide">{label}</label>
      )}
      <div
        className={[
          "flex items-center gap-2 rounded-2xl border bg-slate-950/70 px-3.5 py-2.5 text-sm shadow-soft-card/40 focus-within:border-emerald-400/70 focus-within:ring-1 focus-within:ring-emerald-400/60",
          error ? "border-red-500/70" : "border-emerald-500/30",
          className ?? ""
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon && <span className="text-emerald-300/80">{icon}</span>}
        <input
          className="flex-1 bg-transparent outline-none text-slate-50 placeholder:text-slate-500 text-sm"
          {...props}
        />
        {rightAction && <span className="text-slate-400">{rightAction}</span>}
      </div>
      {description && !error && (
        <p className="text-[11px] text-slate-400 leading-snug">{description}</p>
      )}
      {error && <p className="text-[11px] text-red-400 leading-snug">{error}</p>}
    </div>
  );
}
