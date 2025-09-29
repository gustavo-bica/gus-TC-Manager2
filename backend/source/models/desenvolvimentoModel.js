// source/models/desenvolvimentoModel.js

const db = require("../database/connection"); // A importação agora é simples

const Desenvolvimento = {
    /**
     * Busca as informações principais do trabalho, incluindo orientador e banca.
     */
    getDadosPrincipais: async (idAluno) => {
        const query = `
        SELECT
            T.id_trabalho,
            T.titulo,
            T.link_repositorio,
            ORIENTADOR.nome AS nome_orientador,
            ORIENTADOR.email AS email_orientador,
            GROUP_CONCAT(MEMBRO_BANCA.nome SEPARATOR ', ') AS membros_banca,
            (
                SELECT E.caminho_arquivo 
                FROM ENTREGAS E 
                WHERE E.id_trabalho = T.id_trabalho 
                ORDER BY E.data_entrega DESC 
                LIMIT 1
            ) AS ultimo_arquivo,
            (SELECT U.nome FROM USUARIOS U JOIN TIPOS_USUARIO TU ON U.id_tipo_usuario = TU.id_tipo_usuario WHERE TU.descricao = 'Coordenador' LIMIT 1) AS nome_coordenador,
            (SELECT U.email FROM USUARIOS U JOIN TIPOS_USUARIO TU ON U.id_tipo_usuario = TU.id_tipo_usuario WHERE TU.descricao = 'Coordenador' LIMIT 1) AS email_coordenador
        FROM TRABALHOS AS T
        JOIN USUARIOS AS ORIENTADOR ON T.id_orientador = ORIENTADOR.id_usuario
        LEFT JOIN BANCA_AVALIADORA AS BA ON T.id_trabalho = BA.id_trabalho
        LEFT JOIN USUARIOS AS MEMBRO_BANCA ON BA.id_professor = MEMBRO_BANCA.id_usuario
        WHERE T.id_aluno = ?
        GROUP BY T.id_trabalho, ORIENTADOR.nome, ORIENTADOR.email;
    `;
        const [rows] = await db.execute(query, [idAluno]);
        return rows[0];
    },

    /**
     * Busca a lista de registros de orientação para a tabela de desenvolvimento.
     */
    // source/models/desenvolvimentoModel.js

    getRegistros: async (idTrabalho) => {
        const query = `
        SELECT
            assunto_discutido AS tipo,
            data_reuniao AS data,
            'Realizada' AS status  
        FROM ORIENTACOES
        WHERE id_trabalho = ?
        ORDER BY data_reuniao DESC;
    `;
        const [rows] = await db.execute(query, [idTrabalho]);
        return rows;
    },

    /**
     * Cria um novo registro de orientação (reunião) no banco.
     */
    createRegistro: async (dadosRegistro) => {
        // Adicionamos 'status' aqui
        const { id_trabalho, data_reuniao, assunto_discutido, status } = dadosRegistro;
        // Adicionamos a coluna 'status' e o valor '?' na query
        const query = "INSERT INTO ORIENTACOES (id_trabalho, data_reuniao, assunto_discutido, status) VALUES (?, ?, ?, ?)";
        // Adicionamos a variável 'status' nos parâmetros
        const [result] = await db.execute(query, [id_trabalho, data_reuniao, assunto_discutido, status]);
        return result;
    }
};

module.exports = Desenvolvimento;