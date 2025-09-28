const express = require("express");
const router = express.Router();
const trabalhoController = require("../controllers/trabalhoController");
const upload = require('../config/multerConfig');

// Rota para CARREGAR todos os dados da página de desenvolvimento
// Agora trabalhoController.getDadosPaginaDesenvolvimento vai ser encontrado
router.get("/dados-dev", trabalhoController.getDadosPaginaDesenvolvimento);

// Rota para CRIAR um novo registro na tabela
router.post("/registros-dev", trabalhoController.createRegistro);

// Rota para ATUALIZAR o link
router.put('/link', trabalhoController.atualizarLink);

// Rota para fazer UPLOAD de um arquivo
router.post('/upload', upload.single('arquivo'), trabalhoController.novaEntrega);

module.exports = router;