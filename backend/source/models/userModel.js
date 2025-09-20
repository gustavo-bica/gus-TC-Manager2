const db = require("../../database/connection");

const User = {
    // Busca todos os usuários com o tipo (Aluno, Professor, etc.)
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id_usuario, u.nome, u.email, tu.descricao 
                FROM USUARIOS u
                JOIN TIPOS_USUARIO tu ON u.id_tipo_usuario = tu.id_tipo_usuario
                ORDER BY u.nome;
            `;
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    // Busca um único usuário pelo ID
    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM USUARIOS WHERE id_usuario = ?", [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    },

    // Cria um novo usuário
    create: (userData) => {
        const { nome, email, tx_senha, id_tipo_usuario, id_curso } = userData;
        return new Promise((resolve, reject) => {
            // Lembre-se que a senha (tx_senha) deve ser "hasheada" antes de chegar aqui!
            const query = "INSERT INTO USUARIOS (nome, email, tx_senha, id_tipo_usuario, id_curso) VALUES (?, ?, ?, ?, ?)";
            db.query(query, [nome, email, tx_senha, id_tipo_usuario, id_curso], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    // Atualiza um usuário existente
    update: (id, userData) => {
        const { nome, email } = userData;
        return new Promise((resolve, reject) => {
            const query = "UPDATE USUARIOS SET nome = ?, email = ? WHERE id_usuario = ?";
            db.query(query, [nome, email, id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    // Deleta um usuário
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM USUARIOS WHERE id_usuario = ?", [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
};

module.exports = User;