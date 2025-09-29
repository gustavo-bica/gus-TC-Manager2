const db = require("../config/db");

exports.getAgendaCompleta = async (req, res, next) => {
    try {

        const query = `
            SELECT 
                t.id_trabalho,
                aluno.nome AS nome_aluno,
                orientador.nome AS nome_orientador,
                st.descricao AS status,
                b.data_hora,
                b.local,
                GROUP_CONCAT(membro.nome SEPARATOR ', ') AS membros_banca
            FROM 
                trabalhos AS t
            JOIN 
                usuarios AS aluno ON t.id_aluno = aluno.id_usuario
            JOIN 
                usuarios AS orientador ON t.id_orientador = orientador.id_usuario
            JOIN 
                status_trabalho AS st ON t.id_status = st.id_status
            LEFT JOIN 
                bancas AS b ON t.id_trabalho = b.id_trabalho
            LEFT JOIN 
                banca_avaliadora AS ba ON t.id_trabalho = ba.id_trabalho
            LEFT JOIN 
                usuarios AS membro ON ba.id_professor = membro.id_usuario
            GROUP BY
                t.id_trabalho, aluno.nome, orientador.nome, st.descricao, b.data_hora, b.local
            ORDER BY
                aluno.nome ASC;
        `;

        const [trabalhos] = await db.query(query);
        res.json(trabalhos);

    } catch (error) { 
        console.error("Erro ao buscar dados da agenda: ", error);
        next(error);
    }
}

exports.getBancas = async (req, res, next) => {
    try {
        
        const query = `
            SELECT 
                trabalho.id_trabalho,
                aluno.nome AS nome_aluno,
                orientador.nome AS nome_orientador,
                status_trabalho.descricao AS status,
                IFNULL(banca_details.professores_banca, 'A definir') AS banca
            FROM 
                trabalhos AS trabalho
            INNER JOIN 
                usuarios AS aluno ON trabalho.id_aluno = aluno.id_usuario
            INNER JOIN 
                usuarios AS orientador ON trabalho.id_orientador = orientador.id_usuario
            INNER JOIN 
                status_trabalho ON trabalho.id_status = status_trabalho.id_status
            LEFT JOIN (
                SELECT 
                    ba.id_trabalho, 
                    GROUP_CONCAT(prof.nome SEPARATOR ', ') AS professores_banca
                FROM 
                    banca_avaliadora ba
                JOIN 
                    usuarios prof ON ba.id_professor = prof.id_usuario
                GROUP BY 
                    ba.id_trabalho
            ) AS banca_details ON trabalho.id_trabalho = banca_details.id_trabalho
            ORDER BY
                aluno.nome ASC;
        `;

        const [bancas] = await db.query(query);
        res.json(bancas);

    } catch (error) {
        console.error("Erro ao buscar dados das bancas:", error);
        next(error);
    }
};

exports.definirBanca = async (req, res, next) => {
    const { idTrabalho } = req.params;
    const { data_hora, local, membros } = req.body; 

    if (!data_hora || !local || !membros || !Array.isArray(membros) || membros.length === 0) {
        return res.status(400).json({ message: "Dados incompletos para definir a banca." });
    }

    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction(); 

        // deleta registros antigos para garantir que não haja duplicatas
        await connection.query("DELETE FROM banca_avaliadora WHERE id_trabalho = ?", [idTrabalho]);
        await connection.query("DELETE FROM bancas WHERE id_trabalho = ?", [idTrabalho]);

        // insere o agendamento na nova tabela BANCAS
        const [resultBanca] = await connection.query(
            "INSERT INTO bancas (id_trabalho, data_hora, local) VALUES (?, ?, ?)",
            [idTrabalho, data_hora, local]
        );

        // insere cada membro da banca na tabela 'banca_avaliadora'
        const membrosParaInserir = membros.map(idProfessor => [idTrabalho, idProfessor]);
        await connection.query(
            "INSERT INTO banca_avaliadora (id_trabalho, id_professor) VALUES ?",
            [membrosParaInserir]
        );
        
        await connection.commit(); // confirma todas as operações
        res.status(201).json({ message: "Banca definida com sucesso!" });

    } catch (error) {
        await connection.rollback(); // desfaz tudo em caso de erro
        next(error);
    } finally {
        connection.release(); // libera a conexão
    }
};