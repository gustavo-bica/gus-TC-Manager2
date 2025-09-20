const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rota para LISTAR todos os usuários
// GET http://localhost:3000/users
router.get("/", userController.listarUsuarios);

// Rota para BUSCAR UM usuário pela matrícula (para preencher o form de edição)
// GET http://localhost:3000/users/12345
router.get("/:matricula", userController.listarUsuarioPorMatricula);

// Rota para CRIAR um novo usuário
// POST http://localhost:3000/users
router.post("/", userController.criarUsuario);

// Rota para ATUALIZAR (editar) um usuário
// PUT http://localhost:3000/users/12345
router.put("/:matricula", userController.editarUsuario); // CORRIGIDO: Agora chama a função de editar

// Rota para DELETAR um usuário
// DELETE http://localhost:3000/users/12345
router.delete("/:matricula", userController.excluirUsuario);

module.exports = router;