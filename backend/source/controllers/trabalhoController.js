const Trabalho = require("../models/trabalhoModel");
const db = require('../config/db');


exports.listarTrabalhos = async (req, res, next) => {
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
        
        const [rows] = await db.execute(query);
        res.json(rows);

    } catch (err) {
        console.error('Erro ao buscar trabalhos: ', err);
        err.status = 500;
        err.code = "WORK_FETCH_ERROR";
        err.level = "error";
        next(err);
    }
};

exports.getById = (req, res) => {};
exports.create = (req, res) => {};
exports.update = (req, res) => {};
exports.delete = (req, res) => {};