import React, { useState } from "react";

export default function FormCadastro({ categorias, onCadastrar }) {
  const [form, setForm] = useState({ nome: "", lote: "", validade: "", quantidade: "", categoria: "" });
  const [erro,   setErro]   = useState("");
  const [ok,     setOk]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(""); setOk("");
    const { nome, lote, validade, quantidade, categoria } = form;
    if (!nome || !lote || !validade || !quantidade || !categoria)
      return setErro("Preencha todos os campos.");
    if (Number(quantidade) <= 0) return setErro("Quantidade deve ser maior que zero.");
    setLoading(true);
    try {
      await onCadastrar(form);
      setOk(`${nome} cadastrado com sucesso!`);
      setForm({ nome: "", lote: "", validade: "", quantidade: "", categoria: "" });
      setTimeout(() => setOk(""), 3000);
    } catch { setErro("Erro ao cadastrar. Tente novamente."); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <div className="card-title">Cadastrar medicamento</div>
      {erro && <div className="alert a-err">{erro}</div>}
      {ok  && <div className="alert a-ok">{ok}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="fg full">
          <label>Nome</label>
          <input type="text" value={form.nome} onChange={set("nome")} placeholder="Ex: Amoxicilina 500mg" />
        </div>
        <div className="fg">
          <label>Lote</label>
          <input type="text" value={form.lote} onChange={set("lote")} placeholder="Ex: L2024-099" />
        </div>
        <div className="fg">
          <label>Validade</label>
          <input type="date" value={form.validade} onChange={set("validade")} />
        </div>
        <div className="fg">
          <label>Quantidade</label>
          <input type="number" min="1" value={form.quantidade} onChange={set("quantidade")} placeholder="Unidades" />
        </div>
        <div className="fg">
          <label>Categoria</label>
          <select value={form.categoria} onChange={set("categoria")}>
            <option value="">Selecione...</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg full">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
