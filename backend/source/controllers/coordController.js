const db = require("../config/db");

exports.getAgenda = async (req, res, next) => {
    try {

        const query = `
            SELECT 
                trabalho.id_trabalho,
                aluno.nome AS nome_aluno,
                orientador.nome AS nome_orientador,
                status_trabalho.descricao AS status  -- Usando a coluna 'descricao' correta
            FROM 
                trabalhos AS trabalho
            INNER JOIN 
                usuarios AS aluno ON trabalho.id_aluno = aluno.id_usuario
            INNER JOIN 
                usuarios AS orientador ON trabalho.id_orientador = orientador.id_usuario
            INNER JOIN
                status_trabalho ON trabalho.id_status = status_trabalho.id_status -- Usando a tabela e a coluna de ID corretas
            ORDER BY
                aluno.nome ASC;
        `

        const [trabalhos] = await db.query(query);

        res.json(trabalhos);

    } catch (error) { 
        console.error("Erro ao buscar dados da agenda: ", error);
        next(error);
    }
}
