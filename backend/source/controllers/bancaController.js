const db = require("../config/db")

exports.listarBanca = async (req, res, next) => {
    try {
        const[rows] = await db.query(`
            SELECT 
                u.nome AS nome,
                u.id_usuario AS matricula,
                t.descricao AS tipo
            FROM BANCA_AVALIADORA b
            JOIN USUARIOS u ON b.id_professor = u.id_usuario
            JOIN TIPOS_USUARIO t ON u.id_tipo_usuario = t.id_tipo_usuario
        `);

        res.json(rows);

    } catch (err) { 
        err.status = 500;
        err.code = "BANCA_FETCH_ERROR";
        err.level = "error";
        next(err);
    }
};