// source/routes/professorRoutes.js
const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");

// Rota para o professor VER suas solicitações de orientação
router.get("/solicitacoes", professorController.verSolicitacoes);

// Rota para o professor ACEITAR uma solicitação
router.post("/trabalhos/:idTrabalho/aceitar", professorController.aceitarSolicitacao);

// Rota para o professor RECUSAR uma solicitação
router.post("/trabalhos/:idTrabalho/recusar", professorController.recusarSolicitacao);

module.exports = router;