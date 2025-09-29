const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");
const { authMiddleware, authorize } = require("../middlewares/authMiddleware");

// Rota para o ALUNO listar os orientadores (GET /professores)
//router.get("/", professorController.listarOrientadores);

// Rota para o PROFESSOR ver suas solicitações pendentes (GET /professores/solicitacoes)
router.get("/solicitacoes", authMiddleware, authorize(['professor']),professorController.verSolicitacoes);

// Rotas para o PROFESSOR aceitar ou recusar
router.post("/trabalhos/:idTrabalho/aceitar", professorController.aceitarSolicitacao);
router.post("/trabalhos/:idTrabalho/recusar", professorController.recusarSolicitacao);

router.get("/", authMiddleware, professorController.listarProfessores);

module.exports = router;