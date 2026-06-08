import React, { useState } from "react";
import CardMedicamento from "./CardMedicamento";

export default function PainelBusca({ onBuscarFaixa, onBuscarAlertas, onRemover }) {
  const [aba,    setAba]    = useState("alertas");
  const [dias,   setDias]   = useState(30);
  const [inicio, setInicio] = useState("");
  const [fim,    setFim]    = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro,   setErro]   = useState("");

  const buscarAlertas = async () => {
    setErro(""); setLoading(true);
    try { setResult(await onBuscarAlertas(dias)); }
    catch { setErro("Erro na busca."); }
    finally { setLoading(false); }
  };

  const buscarFaixa = async () => {
    if (!inicio || !fim) return setErro("Informe as duas datas.");
    if (inicio > fim) return setErro("Data inicial deve ser antes da final.");
    setErro(""); setLoading(true);
    try { setResult(await onBuscarFaixa(inicio, fim)); }
    catch { setErro("Erro na busca."); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <div className="card-title">Busca na árvore</div>
      <div className="tab-btns">
        <button className={`tab-btn${aba === "alertas" ? " active" : ""}`} onClick={() => { setAba("alertas"); setResult(null); }}>
          Alertas de vencimento
        </button>
        <button className={`tab-btn${aba === "faixa" ? " active" : ""}`} onClick={() => { setAba("faixa"); setResult(null); }}>
          Busca por faixa
        </button>
      </div>

      {aba === "alertas" && (
        <div className="busca-form">
          <div className="fg">
            <label>Vencendo nos próximos</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="number" min="1" max="365" value={dias} onChange={e => setDias(e.target.value)} style={{ width: 80 }} />
              <span style={{ fontSize: 13, color: "var(--muted)" }}>dias</span>
              <button className="btn-busca" onClick={buscarAlertas} disabled={loading}>Buscar</button>
            </div>
          </div>
          <div className="hint">Usa rangeSearch(hoje, hoje+{dias}d) na RBT — O(log n + k)</div>
        </div>
      )}

      {aba === "faixa" && (
        <div className="busca-form">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div className="fg">
              <label>De</label>
              <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
            </div>
            <div className="fg">
              <label>Até</label>
              <input type="date" value={fim} onChange={e => setFim(e.target.value)} />
            </div>
            <div className="fg" style={{ alignSelf: "flex-end" }}>
              <button className="btn-busca" onClick={buscarFaixa} disabled={loading}>Buscar</button>
            </div>
          </div>
          <div className="hint">Percorre apenas os nós dentro da faixa — O(log n + k)</div>
        </div>
      )}

      {erro && <div className="alert a-err">{erro}</div>}

      {result !== null && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
            {result.length} medicamento(s) encontrado(s)
          </div>
          {result.length === 0
            ? <p style={{ fontSize: 13, color: "var(--muted)" }}>Nenhum medicamento nesta faixa.</p>
            : <div className="med-grid">
                {result.map(m => <CardMedicamento key={m.id} med={m} onRemover={onRemover} />)}
              </div>
          }
        </div>
      )}
    </div>
  );
}
