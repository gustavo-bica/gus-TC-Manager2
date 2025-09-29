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
  
  listarSolicitacoesPendentes: async (idProfessor) => {
    const query = `
        SELECT 
            t.id_trabalho,
            a.nome AS nome_aluno,
            t.titulo AS titulo_trabalho
        FROM 
            trabalhos AS t
        JOIN 
            usuarios AS a ON t.id_aluno = a.id_usuario
        WHERE 
            t.id_orientador = ? AND t.id_status = 2; 
        `;
        
    const [rows] = await db.execute(query, [idProfessor]);
    return rows;
  }

};

module.exports = Professor;