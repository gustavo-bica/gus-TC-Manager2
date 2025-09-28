const db = require("../database/connection");

const Professor = {
  listarOrientadores: async () => {
    const query = `
        SELECT
            U.id_usuario, U.nome, U.email,
            COUNT(T.id_trabalho) AS total_orientandos
        FROM USUARIOS U
        LEFT JOIN TRABALHOS T ON U.id_usuario = T.id_orientador
        WHERE U.id_tipo_usuario = (SELECT id_tipo_usuario FROM TIPOS_USUARIO WHERE descricao = 'professor')
        GROUP BY U.id_usuario, U.nome, U.email
        ORDER BY U.nome;
    `;
    const [rows] = await db.execute(query);
    return rows;
  },
  // ... (outras funções do professor, como listarSolicitacoesPendentes)
};

module.exports = Professor;