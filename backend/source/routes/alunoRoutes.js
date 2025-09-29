const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");
const { authMiddleware, authorize } = require("../middlewares/authMiddleware");

// rota para listar os alunos e seus trabalhos
router.get("/", alunoController.listarAlunos);
router.post("/solicitar-orientador", alunoController.solicitarOrientador);

router.get(
    "/minha-avaliacao",
    authMiddleware,
    authorize(['aluno']),
    alunoController.getMinhaAvaliacao
);

module.exports = router;