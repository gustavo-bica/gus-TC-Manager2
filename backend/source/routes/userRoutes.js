const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// rota para listar usuários
router.get("/usuarios", userController.listarUsuarios);

// rota para excluir usuários
router.delete("/usuarios/:matricula", userController.excluirUsuario);

// rota para editar usário
router.put("/usuario/:matricula", userController.excluirUsuario);

module.exports = router;