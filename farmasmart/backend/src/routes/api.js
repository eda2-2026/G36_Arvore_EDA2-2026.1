const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/medicamentosController");

router.get("/medicamentos",          ctrl.listar);
router.get("/medicamentos/faixa",    ctrl.buscarFaixa);
router.get("/medicamentos/alertas",  ctrl.alertas);
router.post("/medicamentos",         ctrl.cadastrar);
router.delete("/medicamentos/:id",   ctrl.remover);

router.get("/categorias", (_, res) => res.json(ctrl.CATEGORIAS));

module.exports = router;
