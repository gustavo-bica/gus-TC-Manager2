const express = require("express");
const router = express.Router();
const coordController = require("../controllers/coordController");

const { authMiddleware, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/agenda",
    authMiddleware, 
    authorize(['coordenador']),
    coordController.getAgendaCompleta
);

router.get(
    "/bancas",
    authMiddleware,
    authorize(['coordenador']),
    coordController.getBancas
);

router.post(
    "/trabalhos/:idTrabalho/definir-banca",
    authMiddleware,
    authorize(['coordenador']),
    coordController.definirBanca
);

module.exports = router;