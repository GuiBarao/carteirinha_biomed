import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "success" | "danger" | "neutral";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
  danger: "bg-red-500/10 text-red-300 border-red-400/40",
  neutral: "bg-slate-800/80 text-slate-200 border-slate-600/60"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        toneClasses[tone]
      ].join(" ")}
    >
      {children}
    </span>
  );
}

