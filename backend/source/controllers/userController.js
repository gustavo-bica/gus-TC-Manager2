const db = require("../config/db");

// rota para listar usuários
exports.listarUsuarios = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                u.id_usuario, 
                u.nome, 
                u.email, 
                u.matricula, 
                tu.descricao AS tipo_usuario_descricao
            FROM USUARIOS u
            JOIN TIPOS_USUARIO tu ON u.id_tipo_usuario = tu.id_tipo_usuario
            ORDER BY u.nome;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        err.status = 500;
        err.code = "USER_FETCH_ERROR";
        err.level = "error";
        next(err);
    }
};

// rota para excluir um usuário
exports.excluirUsuario = async (req, res, next) => {
    const { matricula } = req.params;
    try {
        const [result] = await db.query("DELETE FROM USUARIOS WHERE matricula = ?", [matricula]);

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
    const { nome, email, id_tipo_usuario, novaMatricula } = req.body;

    if (!nome || !email || !id_tipo_usuario || !novaMatricula) {
        const err = new Error("Todos os campos (nome, email, matrícula, tipo) são obrigatórios!");
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        err.level = "warning";
        return next(err);
    }

    try {
        const [result] = await db.query(
            "UPDATE USUARIOS SET nome = ?, email = ?, matricula = ?, id_tipo_usuario = ? WHERE matricula = ?",
            [nome, email, novaMatricula, id_tipo_usuario, matricula]
        );

        if (result.affectedRows === 0) {
            const err = new Error("Usuário não encontrado.");
            err.status = 404;
            err.code = "USER_NOT_FOUND";
            err.level = "warning";
            return next(err);
        }

        res.json({ message: "Usuário atualizado com sucesso!" });

    } catch (err) {
        err.status = 500;
        err.code = "USER_UPDATE_ERROR";
        err.level = "error";
        next(err);
    }
};

// rota para criar um novo usuário
exports.criarUsuario = async (req, res, next) => {
    // Adicione todos os campos necessários do seu formulário/banco
    const { nome, email, matricula, tx_senha, id_tipo_usuario } = req.body;

    // Lembre-se de validar os campos aqui

    try {
        // IMPORTANTE: A senha (tx_senha) deve ser criptografada (hash) antes de salvar!
        // Ex: const hashedPassword = await bcrypt.hash(tx_senha, 10);
        const [result] = await db.query(
            "INSERT INTO USUARIOS (nome, email, matricula, tx_senha, id_tipo_usuario) VALUES (?, ?, ?, ?, ?)",
            [nome, email, matricula, tx_senha, id_tipo_usuario] // use hashedPassword aqui
        );
        res.status(201).json({ message: "Usuário criado com sucesso!", id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            err.message = "Email ou matrícula já cadastrado.";
            err.status = 409; // 409 Conflict
            err.code = "USER_ALREADY_EXISTS";
            err.level = "warning";
        } else {
            err.status = 500;
            err.code = "USER_CREATE_ERROR";
            err.level = "error";
        }
        next(err);
    }
};

// rota para buscar um usuário pela matrícula
exports.listarUsuarioPorMatricula = async (req, res, next) => {
    const { matricula } = req.params;
    try {
        const [rows] = await db.query("SELECT id_usuario, nome, email, matricula, id_tipo_usuario FROM USUARIOS WHERE matricula = ?", [matricula]);
        if (rows.length === 0) {
            const err = new Error("Usuário não encontrado.");
            err.status = 404;
            err.code = "USER_NOT_FOUND";
            err.level = "warning";
            return next(err);
        }
        res.json(rows[0]);
    } catch (err) {
        err.status = 500;
        err.code = "USER_FETCH_ERROR";
        err.level = "error";
        next(err);
    }
};
/* LISTA DE CÓDIGOS DE ERRO

USER_NOT_FOUND → Usuário não encontrado.
USER_ALREADY_EXISTS → Tentativa de cadastro com email já em uso.
USER_FETCH_ERROR → Erro ao buscar usuários no banco.
USER_UPDATE_ERROR → Erro ao atualizar usuário.
USER_DELETE_ERROR → Erro ao excluir usuário.

*/