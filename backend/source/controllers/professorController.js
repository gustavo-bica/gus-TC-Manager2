const Professor = require('../models/professorModel');
const Trabalho = require('../models/trabalhoModel');

const professorController = {
    // Busca as solicitações pendentes para um professor
    verSolicitacoes: async (req, res, next) => {
        try {
            const idProfessor = 3; // Fixo para teste (Prof. Lima)
            const solicitacoes = await Professor.listarSolicitacoesPendentes(idProfessor);
            res.status(200).json(solicitacoes);
        } catch (err) { next(err); }
    },

    // Aceita a orientação de um trabalho
    aceitarSolicitacao: async (req, res, next) => {
        try {
            const { idTrabalho } = req.params;
            // Status 3 = 'TC em andamento'
            await Trabalho.atualizarStatus(idTrabalho, 3);
            res.status(200).json({ message: "Solicitação aceita!" });
        } catch (err) { next(err); }
    },

    // Recusa a orientação de um trabalho
    recusarSolicitacao: async (req, res, next) => {
        try {
            const { idTrabalho } = req.params;
            await Trabalho.removerOrientador(idTrabalho);
            res.status(200).json({ message: "Solicitação recusada." });
        } catch (err) { next(err); }
    }
};

module.exports = professorController;