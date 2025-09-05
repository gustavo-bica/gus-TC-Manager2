const db = require("../config/db");

// rota para listar usuários
exports.listarUsuarios = async(req, res, next) => {
    try {
        const [rows] = await db.query("SELECT nome, matricula, id_tipo_usuario FROM USUARIOS"); // TODO: verificar id_tipo_usuario
        res.json(rows);
    } catch (err) {
        err.status = 500;
        err.code = "USER_FETCH_ERROR";
        err.level = "error";  // 🔴 alerta vermelho
        next(err);
    }
};

// rota para excluir um usuário
exports.excluirUsuario =  async (req, res, next) => {
    const { matricula } = req.params;
    try {
        const [result] = await db.query ("DELETE FROM USUARIOS WHERE matricula = ?", [matricula]);
        
        if (result.affectedRows === 0) {
            const err = new Error("Usuário não encontrado.");
            err.status = 404;
            err.code = "USER_NOT_FOUND";
            err.level = "warning";  // 🟡 alerta amarelo
            return next(err);
        }

        res.json({ message: "Usuário excluído com sucesso" });

    } catch (err) {
        err.status = 500;
        err.code = "USER_DELETE_ERROR";
        err.level = "error"; // 🔴 alerta vermelho
        next(err);  // envia para o middleware
    }
};

// rota para editar um usuário (exemplo simples)
exports.editarUsuario = async (req, res, next) => {
    const { matricula } = req.params;
    const { nome, id_tipo_usuario } = req.body;

    if (!nome || !id_tipo_usuario) {
        const err = new Error("Nome e tipo são obrigatórios!");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        err.level = "warning";  // // 🟡 alerta amarelo
        return next(err);
    }

    try {
        const [result] = await db.query("UPDATE USUARIOS SET nome = ?, tipo = ? WHERE matricula = ?", [nome, tipo, matricula]);
        
        if (result.affectedRows === 0) {
            const err = new Error("Usuário não encontrado.");
            err.status = 404;
            err.code = "USER_NOT_FOUND";
            err.level = "warning"; // 🟡 alerta amarelo
            return next(err);
        }

        res.json({ message: "Usuário atualizado com sucesso!" });

    } catch (err) {
        err.status = 500;
        err.code = "USER_UPDATE_ERROR";
        err.level = "error";    // 🔴 alerta vermelho
        next(err);  // envia para o middleware
    }
};


/* LISTA DE CÓDIGOS DE ERRO

USER_NOT_FOUND → Usuário não encontrado.
USER_ALREADY_EXISTS → Tentativa de cadastro com email já em uso.
USER_FETCH_ERROR → Erro ao buscar usuários no banco.
USER_UPDATE_ERROR → Erro ao atualizar usuário.
USER_DELETE_ERROR → Erro ao excluir usuário.

*/