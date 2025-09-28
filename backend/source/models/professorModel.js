const db = require("../database/connection");

const Professor = {
  listarOrientadores: async () => {
    const query = `
            SELECT
                U.id_usuario,
                U.nome,
                U.email,
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
  listarSolicitacoesPendentes: async (idProfessor) => {
    const query = `
            SELECT T.id_trabalho, T.titulo, U.nome as nome_aluno, U.email as email_aluno
            FROM TRABALHOS T
            JOIN USUARIOS U ON T.id_aluno = U.id_usuario
            WHERE T.id_orientador = ? AND T.id_status = 2; -- Status 2 = 'Proposta em avaliacao'
        `;
    const [rows] = await db.execute(query, [idProfessor]);
    return rows;
  }
};

module.exports = Professor;