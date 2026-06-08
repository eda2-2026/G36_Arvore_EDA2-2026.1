import React, { useState } from "react";
import { useFarma } from "../hooks/useFarma";
import CardMedicamento from "../components/CardMedicamento";
import FormCadastro from "../components/FormCadastro";
import PainelBusca from "../components/PainelBusca";

const ABAS = ["todos", "alertas", "busca", "cadastrar"];

export default function Dashboard() {
  const { medicamentos, stats, categorias, loading, erro, cadastrar, remover, buscarAlertas, buscarFaixa } = useFarma();
  const [aba, setAba] = useState("todos");
  const [filtro, setFiltro] = useState("todos");

  const medFiltrados = filtro === "todos"    ? medicamentos
    : filtro === "vencidos"  ? medicamentos.filter(m => m.diasRestantes < 0)
    : filtro === "criticos"  ? medicamentos.filter(m => m.diasRestantes >= 0 && m.diasRestantes <= 30)
    : filtro === "atencao"   ? medicamentos.filter(m => m.diasRestantes > 30 && m.diasRestantes <= 90)
    : medicamentos.filter(m => m.diasRestantes > 90);

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">💊</span>
          <div>
            <h1>FarmaSmart</h1>
            <p>Controle de validade · Árvore Vermelho-Preta</p>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>
          <div>Estrutura: Red-Black Tree</div>
          <div>Busca por faixa: O(log n + k)</div>
        </div>
      </header>

      {erro && <div className="alert a-err">{erro}</div>}

      {stats && (
        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Total</div><div className="stat-val">{stats.total}</div></div>
          <div className="stat-card"><div className="stat-label">Vencidos</div><div className="stat-val err">{stats.vencidos}</div></div>
          <div className="stat-card"><div className="stat-label">Críticos (≤30d)</div><div className="stat-val warn">{stats.criticos}</div></div>
          <div className="stat-card"><div className="stat-label">Atenção (≤90d)</div><div className="stat-val info">{stats.atencao}</div></div>
          <div className="stat-card"><div className="stat-label">OK</div><div className="stat-val ok">{stats.ok}</div></div>
        </div>
      )}

      {stats?.primeiroVence && (
        <div className="alerta-banner">
          <span>⚠</span>
          <span>
            Próximo a vencer: <strong>{stats.primeiroVence.nome}</strong> — lote {stats.primeiroVence.lote} em <strong>{stats.primeiroVence.validade}</strong>
          </span>
        </div>
      )}

      <div className="nav-tabs">
        {[["todos","Todos os medicamentos"],["busca","Busca na árvore"],["cadastrar","Cadastrar"]].map(([k, label]) => (
          <button key={k} className={`nav-tab${aba === k ? " active" : ""}`} onClick={() => setAba(k)}>{label}</button>
        ))}
      </div>

      {aba === "todos" && (
        <div>
          <div className="filtro-row">
            {[["todos","Todos"],["vencidos","Vencidos"],["criticos","Críticos"],["atencao","Atenção"],["ok","OK"]].map(([k, label]) => (
              <button key={k} className={`filtro-btn filtro-${k}${filtro === k ? " active" : ""}`} onClick={() => setFiltro(k)}>{label}</button>
            ))}
          </div>
          {loading
            ? <p className="muted-msg">Carregando...</p>
            : <div className="med-grid">
                {medFiltrados.map(m => <CardMedicamento key={m.id} med={m} onRemover={remover} />)}
              </div>
          }
        </div>
      )}

      {aba === "busca" && (
        <PainelBusca onBuscarAlertas={buscarAlertas} onBuscarFaixa={buscarFaixa} onRemover={remover} />
      )}

      {aba === "cadastrar" && (
        <FormCadastro categorias={categorias} onCadastrar={cadastrar} />
      )}
    </div>
  );
}
