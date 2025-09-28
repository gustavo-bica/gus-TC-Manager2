const express = require("express");
const router = express.Router();
const trabalhoController = require("../controllers/trabalhoController");
const upload = require('../config/multerConfig');

// --- ROTAS DA PÁGINA DE DESENVOLVIMENTO ---
router.get("/dados-dev", trabalhoController.getDadosPaginaDesenvolvimento);
router.post("/registros-dev", trabalhoController.createRegistro);

// --- ROTAS DE ARQUIVO E LINK ---
router.put('/link', trabalhoController.atualizarLink);
router.post('/upload', upload.single('arquivo'), trabalhoController.novaEntrega);

// --- ROTA DA PÁGINA DE DEFINIR ORIENTADOR ---
router.post('/solicitar-orientador', trabalhoController.solicitarOrientador);


module.exports = router;