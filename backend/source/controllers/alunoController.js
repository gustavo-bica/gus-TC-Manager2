// source/controllers/alunoController.js

const Trabalho = require('../models/trabalhoModel'); // <-- LINHA ADICIONADA PARA CORRIGIR O ERRO
const db = require("../config/db"); // Presumo que você use isso para o listarAlunos

// Rota para listar os alunos e seus trabalhos
exports.listarAlunos = async (req, res, next) => {
    try {
        const [rows] = await db.query(`
            SELECT
                a.nome AS aluno,
                o.nome AS orientador,
                s.descricao AS status,
                CAST(
                    CONCAT(
                        (SELECT COUNT(*) FROM BANCA_AVALIADORA ba WHERE ba.id_trabalho = t.id_trabalho),
                        '/2'
                    ) AS CHAR
                ) AS banca
            FROM TRABALHOS t
            JOIN USUARIOS a ON t.id_aluno = a.id_usuario
            JOIN USUARIOS o ON t.id_orientador = o.id_usuario
            JOIN STATUS_TRABALHO s ON t.id_status = s.id_status;
        `);
        res.json(rows);
    } catch (err) {
        err.status = 500;
        err.code = "ALUNO_FETCH_ERROR";
        err.level = "error";
        next(err);
    }
};

// Rota para o aluno solicitar um orientador
exports.solicitarOrientador = async (req, res, next) => {
    try {
        const idAluno = 2; // Exemplo: ID do "João"
        const { id_orientador } = req.body;

        if (!id_orientador) {
            return res.status(400).json({ message: "ID do orientador é obrigatório." });
        }

        // Agora a variável "Trabalho" existe e estas linhas vão funcionar
        const trabalho = await Trabalho.findByAlunoId(idAluno);
        if (!trabalho) {
            return res.status(404).json({ message: "Trabalho do aluno não encontrado para este usuário." });
        }

        await Trabalho.definirOrientador(trabalho.id_trabalho, id_orientador);

        res.status(200).json({ message: "Orientador solicitado com sucesso!" });

    } catch (err) {
        console.error("Erro ao solicitar orientador:", err);
        next(err); 
    }
};

exports.getMinhaAvaliacao = async (req, res, next) => {
    
    const idAlunoLogado = req.user.id;

    try {
        // busca dados principais do trabalho e orientador
        const [trabalhoInfo] = await db.query(`
            SELECT
                t.id_trabalho,
                aluno.id_curso,
                orientador.nome AS nome_orientador,
                orientador.email AS email_orientador
            FROM trabalhos AS t
            JOIN usuarios AS orientador ON t.id_orientador = orientador.id_usuario
            JOIN usuarios AS aluno ON t.id_aluno = aluno.id_usuario
            WHERE t.id_aluno = ?;
        `, [idAlunoLogado]);

        if (trabalhoInfo.length === 0) {
            return res.json({ message: "Nenhum trabalho encontrado para este aluno."});
        }

        const meuTrabalho = trabalhoInfo[0];

        // busca os membros da banca
        const [banca] = await db.query(`
            SELECT u.nome, u.email
            FROM banca_avaliadora AS ba
            JOIN usuarios AS u ON ba.id_professor = u.id_usuario
            WHERE ba.id_trabalho = ?;
            `, [meuTrabalho.id_trabalho]);

        const [coordenadorInfo] = await db.query(`
            SELECT nome, email 
            FROM usuarios 
            WHERE id_tipo_usuario = 3 AND id_curso = ?;
            `, [meuTrabalho.id_curso]);

        // busca a próxima entrega pendente
        const [proximaEntrega] = await db.query(`
            SELECT e.descricao, en.data_prevista, en.caminho_arquivo
            FROM entregas AS en
            JOIN etapas AS e ON en.id_etapa = e.id_etapa
            WHERE en.id_trabalho = ? AND en.data_entrega IS NULL
            ORDER BY en.data_prevista ASC
            LIMIT 1;
            `, [meuTrabalho.id_trabalho]);

        // busca o histórico de todas as entregas
        const [historicoEntregas] = await db.query(`
            SELECT e.descricao, en.data_entrega, en.data_prevista
            FROM entregas AS en
            JOIN etapas AS e ON en.id_etapa = e.id_etapa
            WHERE en.id_trabalho = ?
            ORDER BY en.data_prevista ASC;
            `, [meuTrabalho.id_trabalho]);

        const dadosFinais = {
            orientador: meuTrabalho,
            banca: banca, // array de membros da banca
            coordenador: coordenadorInfo[0] || null,
            etapaAtual: proximaEntrega[0] || null,
            historico: historicoEntregas
        };

        res.json(dadosFinais);

    } catch (error) {
        console.error("Erro ao buscar dados de avaliação do aluno", error);
        next(error);
    }
};