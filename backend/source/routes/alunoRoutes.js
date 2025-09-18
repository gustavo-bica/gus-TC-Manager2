const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");

// rota para listar os alunos e seus trabalhos
router.get("/", alunoController.listarAlunos);

module.exports = router;