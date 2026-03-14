import { ArrowRight, TicketPercent } from "lucide-react";
import { Button } from "../ui/Button";

type PartnerCardProps = {
  name: string;
  benefit: string;
  description: string;
  category?: string;
};

export function PartnerCard({ name, benefit, description, category }: PartnerCardProps) {
  return (
    <article className="glass-panel bg-slate-950/90 border-emerald-500/25 p-4 flex gap-3 sm:gap-4">
      <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-semibold uppercase tracking-wide">
        LOGO
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-slate-50">{name}</h3>
            {category && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 text-[11px] text-slate-200/90">
                {category}
              </span>
            )}
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
            <TicketPercent className="h-3.5 w-3.5" />
            {benefit}
          </p>
          <p className="mt-1.5 text-[12px] text-slate-300/90 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Válido mediante apresentação da carteirinha digital.
          </p>
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Ver detalhes
          </Button>
        </div>
      </div>
    </article>
  );
}

