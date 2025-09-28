const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");

// Rota para o ALUNO listar os orientadores (GET /professores)
router.get("/", professorController.listarOrientadores);

// Rota para o PROFESSOR ver suas solicitações pendentes (GET /professores/solicitacoes)
router.get("/solicitacoes", professorController.verSolicitacoes);

// Rotas para o PROFESSOR aceitar ou recusar
router.post("/trabalhos/:idTrabalho/aceitar", professorController.aceitarSolicitacao);
router.post("/trabalhos/:idTrabalho/recusar", professorController.recusarSolicitacao);

module.exports = router;