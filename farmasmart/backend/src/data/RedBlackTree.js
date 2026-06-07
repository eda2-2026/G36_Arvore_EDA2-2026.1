// Árvore Vermelho-Preta ordenada por data de validade
// Suporta inserção, remoção, busca por faixa e busca do mínimo

const RED   = "RED";
const BLACK = "BLACK";

class Node {
  constructor(med) {
    this.med    = med;          // { id, nome, lote, validade (Date), quantidade, categoria }
    this.color  = RED;
    this.left   = null;
    this.right  = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    // Sentinela NIL — folha preta que simplifica os casos de borda
    this.NIL        = new Node(null);
    this.NIL.color  = BLACK;
    this.NIL.left   = this.NIL;
    this.NIL.right  = this.NIL;
    this.root       = this.NIL;
    this.size       = 0;
    this.ops        = 0; // contador de operações para fins didáticos
  }

  // Chave de comparação: data de validade, desempate por id
  _cmp(a, b) {
    const diff = a.validade.getTime() - b.validade.getTime();
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  }

  // --- Rotações ---
  _rotateLeft(x) {
    const y  = x.right;
    x.right  = y.left;
    if (y.left !== this.NIL) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === null)         this.root    = y;
    else if (x === x.parent.left)  x.parent.left  = y;
    else                           x.parent.right = y;
    y.left   = x;
    x.parent = y;
  }

  _rotateRight(x) {
    const y  = x.left;
    x.left   = y.right;
    if (y.right !== this.NIL) y.right.parent = x;
    y.parent = x.parent;
    if (x.parent === null)         this.root    = y;
    else if (x === x.parent.right) x.parent.right = y;
    else                           x.parent.left  = y;
    y.right  = x;
    x.parent = y;
  }

  // --- Inserção ---
  insert(med) {
    const z  = new Node(med);
    z.left   = this.NIL;
    z.right  = this.NIL;
    let y    = null;
    let x    = this.root;
    while (x !== this.NIL) {
      this.ops++;
      y = x;
      x = this._cmp(z.med, x.med) < 0 ? x.left : x.right;
    }
    z.parent = y;
    if (y === null)             this.root   = z;
    else if (this._cmp(z.med, y.med) < 0) y.left  = z;
    else                        y.right = z;
    this.size++;
    this._fixInsert(z);
  }

  _fixInsert(z) {
    while (z.parent && z.parent.color === RED) {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right;
        if (y.color === RED) {
          // Caso 1: tio vermelho — recolorir
          z.parent.color         = BLACK;
          y.color                = BLACK;
          z.parent.parent.color  = RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) { z = z.parent; this._rotateLeft(z); }
          // Caso 3: rotação direita
          z.parent.color        = BLACK;
          z.parent.parent.color = RED;
          this._rotateRight(z.parent.parent);
        }
      } else {
        const y = z.parent.parent.left;
        if (y.color === RED) {
          z.parent.color        = BLACK;
          y.color               = BLACK;
          z.parent.parent.color = RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) { z = z.parent; this._rotateRight(z); }
          z.parent.color        = BLACK;
          z.parent.parent.color = RED;
          this._rotateLeft(z.parent.parent);
        }
      }
      if (z === this.root) break;
    }
    this.root.color = BLACK;
  }

  // --- Remoção ---
  delete(id) {
    const node = this._findById(this.root, id);
    if (!node) return false;
    this._delete(node);
    this.size--;
    return true;
  }

  _findById(node, id) {
    if (node === this.NIL || node === null) return null;
    if (node.med.id === id) return node;
    return this._findById(node.left, id) || this._findById(node.right, id);
  }

  _minimum(node) {
    while (node.left !== this.NIL) node = node.left;
    return node;
  }

  _transplant(u, v) {
    if (u.parent === null)          this.root       = v;
    else if (u === u.parent.left)   u.parent.left   = v;
    else                            u.parent.right  = v;
    v.parent = u.parent;
  }

  _delete(z) {
    let y = z, origColor = y.color, x;
    if (z.left === this.NIL) {
      x = z.right; this._transplant(z, z.right);
    } else if (z.right === this.NIL) {
      x = z.left;  this._transplant(z, z.left);
    } else {
      y = this._minimum(z.right);
      origColor = y.color;
      x = y.right;
      if (y.parent === z) { x.parent = y; }
      else {
        this._transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this._transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }
    if (origColor === BLACK) this._fixDelete(x);
  }

  _fixDelete(x) {
    while (x !== this.root && x.color === BLACK) {
      if (x === x.parent.left) {
        let w = x.parent.right;
        if (w.color === RED) {
          w.color = BLACK; x.parent.color = RED;
          this._rotateLeft(x.parent); w = x.parent.right;
        }
        if (w.left.color === BLACK && w.right.color === BLACK) {
          w.color = RED; x = x.parent;
        } else {
          if (w.right.color === BLACK) {
            w.left.color = BLACK; w.color = RED;
            this._rotateRight(w); w = x.parent.right;
          }
          w.color = x.parent.color; x.parent.color = BLACK;
          w.right.color = BLACK; this._rotateLeft(x.parent);
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        if (w.color === RED) {
          w.color = BLACK; x.parent.color = RED;
          this._rotateRight(x.parent); w = x.parent.left;
        }
        if (w.right.color === BLACK && w.left.color === BLACK) {
          w.color = RED; x = x.parent;
        } else {
          if (w.left.color === BLACK) {
            w.right.color = BLACK; w.color = RED;
            this._rotateLeft(w); w = x.parent.left;
          }
          w.color = x.parent.color; x.parent.color = BLACK;
          w.left.color = BLACK; this._rotateRight(x.parent);
          x = this.root;
        }
      }
    }
    x.color = BLACK;
  }

  // --- Buscas ---

  // Busca por faixa de validade [dataInicio, dataFim]
  rangeSearch(dataInicio, dataFim) {
    const result = [];
    this._range(this.root, dataInicio, dataFim, result);
    return result;
  }

  _range(node, ini, fim, result) {
    if (node === this.NIL) return;
    this.ops++;
    if (node.med.validade >= ini) this._range(node.left, ini, fim, result);
    if (node.med.validade >= ini && node.med.validade <= fim) result.push(node.med);
    if (node.med.validade <= fim) this._range(node.right, ini, fim, result);
  }

  // Mínimo da árvore = medicamento que vence primeiro
  minimum() {
    if (this.root === this.NIL) return null;
    return this._minimum(this.root).med;
  }

  // In-order = todos ordenados por validade
  inOrder() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  _inOrder(node, result) {
    if (node === this.NIL) return;
    this._inOrder(node.left, result);
    result.push(node.med);
    this._inOrder(node.right, result);
  }

  // Serializa a árvore para envio ao frontend (para visualização)
  toJSON() {
    const serialize = (node) => {
      if (node === this.NIL) return null;
      return {
        med:   node.med,
        color: node.color,
        left:  serialize(node.left),
        right: serialize(node.right),
      };
    };
    return { root: serialize(this.root), size: this.size };
  }
}

module.exports = RedBlackTree;
