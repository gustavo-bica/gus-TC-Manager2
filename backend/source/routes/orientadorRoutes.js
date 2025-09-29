const express = require("express");
const router = express.Router();
const orientadorController = require("../controllers/orientadorController");
const { authMiddleware, authorize } = require("../middlewares/authMiddleware");

router.get(
    "/meus-orientandos",
    authMiddleware,
    authorize(['professor']),
    orientadorController.getMeusOrientandos
);

router.get(
    "/possiveis-orientandos",
    authMiddleware,
    authorize(['professor']),
    orientadorController.getAlunosSemOrientador
);

module.exports = router;