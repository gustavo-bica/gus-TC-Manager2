const Trabalho = require("../models/trabalhoModel");
const db = require('../config/db');


exports.listarTrabalhos = async (req, res, next) => {
    try {
        const query = `
            SELECT
                T.titulo,
                A.nome AS aluno,
                O.nome AS orientador,
                NULL AS prazo,
                ST.descricao AS status,
                (SELECT GROUP_CONCAT(U.nome SEPARATOR ', ')
                 FROM BANCA_AVALIADORA BA
                 JOIN USUARIOS U ON BA.id_professor = U.id_usuario
                 WHERE BA.id_trabalho = T.id_trabalho) AS banca
            FROM TRABALHOS T
            JOIN USUARIOS A ON T.id_aluno = A.id_usuario
            JOIN USUARIOS O ON T.id_orientador = O.id_usuario
            JOIN STATUS_TRABALHO ST ON T.id_status = ST.id_status;
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