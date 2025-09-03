const express = require("express");
const router = express.Router();
const db = require("../config/db");

// rota para listar usuários
router.get("/usuarios", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT nome, matricula, id_tipo_usuario FROM USUARIOS"); // TODO: verificar id_tipo_usuario
        res.json(rows);
    } catch (err) {
        console.error("Erro ao buscar usuários: ", err);
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});

// rota para excluir um usuário
router.delete("/usuarios/:matricula", async (req, res) => {
    const { matricula } = req.params;
    try {
        await db.query("DELETE FROM USUARIOS WHERE matricula = ?", [matricula]);
        res.json({ message: "Usuário excluído com sucesso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao excluir usuário" });
    }
});

// rota para editar um usuário (exemplo simples)
router.put("/usuarios/:matricula", async (req, res) => {
    const { matricula } = req.params;
    const { nome, id_tipo_usuario } = req.body;

    if (!nome || !id_tipo_usuario) {
        return res.status(400).json({ error: "Nome e tipo são obrigatórios!" });
    }

    try {
        await db.query("UPDATE USUARIOS SET nome = ?, tipo = ? WHERE matricula = ?", [nome, tipo, matricula]);
        res.json({ message: "Usuário atualizado com sucesso!" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

module.exports = router;