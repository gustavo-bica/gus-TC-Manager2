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