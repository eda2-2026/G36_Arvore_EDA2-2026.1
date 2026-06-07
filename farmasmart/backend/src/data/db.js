const { v4: uuidv4 } = require("uuid");
const RedBlackTree = require("./RedBlackTree");

const tree = new RedBlackTree();

const CATEGORIAS = ["Antibiótico", "Analgésico", "Anti-inflamatório", "Vitamina", "Antialérgico", "Antifúngico", "Antihipertensivo"];

const medicamentosIniciais = [
  { nome: "Amoxicilina 500mg",     lote: "L2024-001", validade: "2025-01-15", quantidade: 120, categoria: "Antibiótico" },
  { nome: "Dipirona 1g",           lote: "L2024-002", validade: "2025-02-10", quantidade: 80,  categoria: "Analgésico" },
  { nome: "Ibuprofeno 400mg",      lote: "L2024-003", validade: "2025-03-20", quantidade: 200, categoria: "Anti-inflamatório" },
  { nome: "Vitamina C 1g",         lote: "L2024-004", validade: "2025-05-30", quantidade: 350, categoria: "Vitamina" },
  { nome: "Loratadina 10mg",       lote: "L2024-005", validade: "2025-04-15", quantidade: 60,  categoria: "Antialérgico" },
  { nome: "Cetirizina 10mg",       lote: "L2024-006", validade: "2025-06-01", quantidade: 90,  categoria: "Antialérgico" },
  { nome: "Fluconazol 150mg",      lote: "L2024-007", validade: "2025-07-22", quantidade: 40,  categoria: "Antifúngico" },
  { nome: "Enalapril 10mg",        lote: "L2024-008", validade: "2025-08-18", quantidade: 150, categoria: "Antihipertensivo" },
  { nome: "Paracetamol 750mg",     lote: "L2024-009", validade: "2025-09-05", quantidade: 300, categoria: "Analgésico" },
  { nome: "Azitromicina 500mg",    lote: "L2024-010", validade: "2025-10-12", quantidade: 55,  categoria: "Antibiótico" },
  { nome: "Vitamina D 2000UI",     lote: "L2024-011", validade: "2026-01-20", quantidade: 180, categoria: "Vitamina" },
  { nome: "Omeprazol 20mg",        lote: "L2024-012", validade: "2025-12-31", quantidade: 220, categoria: "Anti-inflamatório" },
  { nome: "Losartana 50mg",        lote: "L2024-013", validade: "2026-03-14", quantidade: 130, categoria: "Antihipertensivo" },
  { nome: "Clonazepam 2mg",        lote: "L2024-014", validade: "2025-11-08", quantidade: 30,  categoria: "Analgésico" },
  { nome: "Dexametasona 4mg",      lote: "L2024-015", validade: "2025-01-28", quantidade: 45,  categoria: "Anti-inflamatório" },
];

medicamentosIniciais.forEach(m => {
  tree.insert({
    id:         uuidv4(),
    nome:       m.nome,
    lote:       m.lote,
    validade:   new Date(m.validade),
    quantidade: m.quantidade,
    categoria:  m.categoria,
  });
});

module.exports = { tree, CATEGORIAS };
