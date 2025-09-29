const db = require("../config/db");

exports.getMeusOrientandos = async (req, res, next) => {
    
    const idOrientadorLogado = req.user.id;

    try {
        
        const query = `
            SELECT
                a.nome AS aluno,
                o.nome AS orientador,
                e.descricao AS prazo,
                s.descricao AS status,
                CONCAT(
                    CAST((SELECT COUNT(*) 
                        FROM BANCA_AVALIADORA ba 
                        WHERE ba.id_trabalho = t.id_trabalho) AS CHAR),
                    '/2'
                ) AS banca
            FROM TRABALHOS t
            JOIN USUARIOS a ON t.id_aluno = a.id_usuario
            JOIN USUARIOS o ON t.id_orientador = o.id_usuario
            JOIN STATUS_TRABALHO s ON t.id_status = s.id_status
            LEFT JOIN AVALIACOES av ON av.id_trabalho = t.id_trabalho
            LEFT JOIN ETAPAS e ON av.id_etapa = e.id_etapa;
        `;

        const [orientandos] = await db.query(query, [idOrientadorLogado]);
        
        res.json(orientandos);

    } catch (error) {
        console.error("Erro ao buscar orientandos:", error);
        next(error);
    }
};