import { useRef, useState } from "react";
import { MembershipCard } from "../components/cards/MembershipCard";
import { Button } from "../components/ui/Button";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function CarteirinhaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!pdfRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 3, canvas.height / 3] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`carteirinha-${user?.rgm ?? "associado"}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-slate-50 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.22),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(16,185,129,0.4),_transparent_55%),_linear-gradient(135deg,_#020617_0%,_#022c22_50%,_#020617_100%)]">
      <div className="w-full max-w-xs space-y-6">

        {/* Card visível na tela */}
        <MembershipCard
          name={user?.complete_name ?? ""}
          rgm={user?.rgm ?? ""}
          status="ativo"
        />

        <Button
          fullWidth
          variant="secondary"
          leftIcon={downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Gerando PDF..." : "Baixar carteirinha"}
        </Button>

        <Button
          variant="ghost"
          fullWidth
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
      </div>

      {/* Layout oculto capturado pelo html2canvas para gerar o PDF */}
      <div className="absolute left-[-9999px] top-0" aria-hidden>
        <div
          ref={pdfRef}
          style={{
            width: 320,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: "32px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            fontFamily: "Inter, system-ui, sans-serif",
            border: "2px solid #d1fae5",
            boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
          }}
        >
          {/* Brasão */}
          <img
            src="/imagens/pato-biomed.png"
            alt="Brasão Atlética Patológicos"
            style={{ width: 96, height: 96, objectFit: "contain" }}
            crossOrigin="anonymous"
          />

          {/* Nome da atlética */}
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1.4 }}>
              Atlética Patológicos Biomedicina
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6b7280", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              UNIGRAN
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "linear-gradient(to right, transparent, #34d399, transparent)" }} />

          {/* Dados */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, textAlign: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.22em" }}>Nome</p>
              <p style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 600, color: "#111827" }}>
                {user?.complete_name ?? ""}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.22em" }}>RGM</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 500, color: "#374151", fontFamily: "monospace" }}>
                {user?.rgm ?? ""}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "linear-gradient(to right, transparent, #34d399, transparent)" }} />

          {/* Status */}
          <span style={{color:"black"}}>
            ✓ Associado ativo
          </span>
        </div>
      </div>
    </div>
  );
}
