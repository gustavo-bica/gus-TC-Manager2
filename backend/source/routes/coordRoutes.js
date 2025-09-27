const express = require("express");
const router = express.Router();
const coordController = require("../controllers/coordController");

const { authMiddleware, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/agenda",
    authMiddleware, 
    authorize(['coordenador']), // <-- apenas coordenador é permitido
    coordController.getAgenda
);

router.get(
    "/bancas",
    authMiddleware,
    authorize(['coordenador']),
    coordController.getBancas
);

module.exports = router;