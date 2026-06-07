const { v4: uuidv4 } = require("uuid");
const { tree, CATEGORIAS } = require("../data/db");

// Lista todos ordenados por validade (in-order da RBT)
function listar(req, res) {
  const hoje = new Date();
  const todos = tree.inOrder().map(m => ({
    ...m,
    validade:      m.validade.toISOString().split("T")[0],
    diasRestantes: Math.ceil((m.validade - hoje) / (1000 * 60 * 60 * 24)),
  }));
  res.json({
    medicamentos: todos,
    arvore:       tree.toJSON(),
    stats: {
      total:       tree.size,
      vencidos:    todos.filter(m => m.diasRestantes < 0).length,
      criticos:    todos.filter(m => m.diasRestantes >= 0 && m.diasRestantes <= 30).length,
      atencao:     todos.filter(m => m.diasRestantes > 30 && m.diasRestantes <= 90).length,
      ok:          todos.filter(m => m.diasRestantes > 90).length,
      primeiroVence: tree.minimum() ? { ...tree.minimum(), validade: tree.minimum().validade.toISOString().split("T")[0] } : null,
    },
  });
}

// Busca por faixa de validade
function buscarFaixa(req, res) {
  const { inicio, fim } = req.query;
  if (!inicio || !fim)
    return res.status(400).json({ erro: "Informe inicio e fim (YYYY-MM-DD)." });

  const dataInicio = new Date(inicio);
  const dataFim    = new Date(fim);
  dataFim.setHours(23, 59, 59);

  const resultado = tree.rangeSearch(dataInicio, dataFim).map(m => ({
    ...m,
    validade:      m.validade.toISOString().split("T")[0],
    diasRestantes: Math.ceil((m.validade - new Date()) / (1000 * 60 * 60 * 24)),
  }));

  res.json({ medicamentos: resultado, total: resultado.length });
}

// Busca os que vencem nos próximos N dias
function alertas(req, res) {
  const dias  = parseInt(req.query.dias) || 30;
  const hoje  = new Date();
  const limite = new Date();
  limite.setDate(limite.getDate() + dias);

  const resultado = tree.rangeSearch(new Date("2000-01-01"), limite).map(m => ({
    ...m,
    validade:      m.validade.toISOString().split("T")[0],
    diasRestantes: Math.ceil((m.validade - hoje) / (1000 * 60 * 60 * 24)),
  }));

  res.json({ medicamentos: resultado, total: resultado.length, diasConsultados: dias });
}

// Cadastrar medicamento
function cadastrar(req, res) {
  const { nome, lote, validade, quantidade, categoria } = req.body;
  if (!nome || !lote || !validade || !quantidade || !categoria)
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });

  const med = {
    id:         uuidv4(),
    nome,
    lote,
    validade:   new Date(validade),
    quantidade: Number(quantidade),
    categoria,
  };
  tree.insert(med);
  res.status(201).json({ mensagem: "Medicamento cadastrado.", medicamento: { ...med, validade } });
}

// Remover medicamento (retirada do estoque ou vencido)
function remover(req, res) {
  const removido = tree.delete(req.params.id);
  if (!removido) return res.status(404).json({ erro: "Medicamento não encontrado." });
  res.json({ mensagem: "Medicamento removido do estoque." });
}

module.exports = { listar, buscarFaixa, alertas, cadastrar, remover, CATEGORIAS };
