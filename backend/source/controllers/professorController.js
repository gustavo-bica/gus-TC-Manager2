const Professor = require('../models/professorModel');
const Trabalho = require('../models/trabalhoModel');
const db = require("../config/db");

const professorController = {
    // Para o aluno listar os professores disponíveis
    listarOrientadores: async (req, res, next) => {
        try {
            const orientadores = await Professor.listarOrientadores();
            res.status(200).json(orientadores);
        } catch (err) { next(err); }
    },

    // Para o professor ver suas solicitações pendentes
    verSolicitacoes: async (req, res, next) => {
        try {
            const idProfessor = 3; // Fixo para teste (Prof. Lima)
            const solicitacoes = await Professor.listarSolicitacoesPendentes(idProfessor);
            res.status(200).json(solicitacoes);
        } catch (err) { next(err); }
    },

    // Para o professor aceitar uma solicitação
    aceitarSolicitacao: async (req, res, next) => {
        try {
            const { idTrabalho } = req.params;
            await Trabalho.atualizarStatus(idTrabalho, 3); // Status 3 = 'TC em andamento'
            res.status(200).json({ message: "Solicitação aceita!" });
        } catch (err) { next(err); }
    },

    // Para o professor recusar uma solicitação
    recusarSolicitacao: async (req, res, next) => {
        try {
            const { idTrabalho } = req.params;
            await Trabalho.removerOrientador(idTrabalho);
            res.status(200).json({ message: "Solicitação recusada." });
        } catch (err) { next(err); }
    },

    listarProfessores: async (req, res, next) => {
        try {
            const query = `
                SELECT 
                    u.id_usuario,
                    u.nome,
                    u.email,
                    COUNT(t.id_trabalho) AS total_orientandos
                FROM 
                    usuarios AS u
                LEFT JOIN 
                    trabalhos AS t ON u.id_usuario = t.id_orientador
                WHERE 
                    u.id_tipo_usuario = 2 -- id_tipo_usuario = 2 para 'professor'
                GROUP BY
                    u.id_usuario, u.nome, u.email
                ORDER BY
                    u.nome ASC;
            `;

            const [professores] = await db.query(query);
            res.json(professores);

        } catch (error) { 
            next(error);
        }
    }
};

module.exports = professorController;
