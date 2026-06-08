import React from "react";

function statusInfo(dias) {
  if (dias < 0)   return { label: "Vencido",   cls: "badge-vencido",  cor: "#991b1b" };
  if (dias <= 30)  return { label: "Crítico",   cls: "badge-critico",  cor: "#92400e" };
  if (dias <= 90)  return { label: "Atenção",   cls: "badge-atencao",  cor: "#1e40af" };
  return             { label: "OK",          cls: "badge-ok",       cor: "#166534" };
}

export default function CardMedicamento({ med, onRemover }) {
  const { label, cls, cor } = statusInfo(med.diasRestantes);
  return (
    <div className={`med-card ${med.diasRestantes < 0 ? "card-vencido" : med.diasRestantes <= 30 ? "card-critico" : ""}`}>
      <div className="med-header">
        <div className="med-nome">{med.nome}</div>
        <span className={`badge ${cls}`}>{label}</span>
      </div>
      <div className="med-body">
        <div className="med-info-row">
          <span className="med-label">Lote</span>
          <span className="med-val">{med.lote}</span>
        </div>
        <div className="med-info-row">
          <span className="med-label">Validade</span>
          <span className="med-val" style={{ color: cor, fontWeight: 500 }}>{med.validade}</span>
        </div>
        <div className="med-info-row">
          <span className="med-label">Dias restantes</span>
          <span className="med-val" style={{ color: cor, fontWeight: 500 }}>
            {med.diasRestantes < 0 ? `${Math.abs(med.diasRestantes)}d atrás` : `${med.diasRestantes}d`}
          </span>
        </div>
        <div className="med-info-row">
          <span className="med-label">Quantidade</span>
          <span className="med-val">{med.quantidade} un.</span>
        </div>
        <div className="med-info-row">
          <span className="med-label">Categoria</span>
          <span className="med-val">{med.categoria}</span>
        </div>
      </div>
      <button className="btn-remover" onClick={() => onRemover(med.id)}>
        Retirar do estoque
      </button>
    </div>
  );
}
