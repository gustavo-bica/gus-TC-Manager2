const Trabalho = require("../models/trabalhoModel");
const Desenvolvimento = require("../models/desenvolvimentoModel");
const Professor = require("../models/professorModel");

const trabalhoController = {

    // --- FUNÇÕES DA PÁGINA DE DESENVOLVIMENTO ---

    getDadosPaginaDesenvolvimento: async (req, res, next) => {
        try {
            const idAluno = 2; // Fixo para teste
            const dadosPrincipais = await Desenvolvimento.getDadosPrincipais(idAluno);
            if (!dadosPrincipais) return res.status(404).json({ message: "Nenhum trabalho encontrado." });
            const registros = await Desenvolvimento.getRegistros(dadosPrincipais.id_trabalho);
            
            res.status(200).json({
                dadosPrincipais: dadosPrincipais,
                infoParticipantes: {
                    orientador: { nome: dadosPrincipais.nome_orientador, email: dadosPrincipais.email_orientador },
                    banca: dadosPrincipais.membros_banca ? dadosPrincipais.membros_banca.split(', ') : [],
                },
                registros: registros
            });
        } catch (err) { next(err); }
    },

    createRegistro: async (req, res, next) => {
        try {
            const idAluno = 2;
            const { tipo, data } = req.body;
            if (!tipo || !data) return res.status(400).json({ message: "Os campos são obrigatórios." });

            const trabalho = await Trabalho.findByAlunoId(idAluno);
            if (!trabalho) return res.status(404).json({ message: "Trabalho não encontrado." });

            const novoRegistro = {
                id_trabalho: trabalho.id_trabalho,
                assunto_discutido: tipo,
                data_reuniao: data,
                status: 'Realizada'
            };
            await Desenvolvimento.createRegistro(novoRegistro);
            res.status(201).json({ message: "Registro criado com sucesso!" });
        } catch (err) { next(err); }
    },

    // --- FUNÇÕES DE ARQUIVO E LINK ---

    atualizarLink: async (req, res, next) => {
        try {
            const idAluno = 2;
            const { link } = req.body;
            if (!link) return res.status(400).json({ message: "O link é obrigatório." });
            
            const trabalho = await Trabalho.findByAlunoId(idAluno);
            if (!trabalho) return res.status(404).json({ message: "Trabalho não encontrado." });

            const result = await Trabalho.updateLink(trabalho.id_trabalho, link);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Não foi possível encontrar o trabalho para atualizar.' });
            
            res.status(200).json({ message: "Link atualizado com sucesso!", link });
        } catch (err) { next(err); }
    },

    novaEntrega: async (req, res, next) => {
        try {
            const idAluno = 2;
            if (!req.file) return res.status(400).json({ message: "Nenhum arquivo enviado." });

            const trabalho = await Trabalho.findByAlunoId(idAluno);
            if (!trabalho) return res.status(404).json({ message: "Trabalho não encontrado." });
            
            const dadosEntrega = {
                id_trabalho: trabalho.id_trabalho,
                id_etapa: 2,
                data_prevista: '2025-10-10',
                data_entrega: new Date(),
                caminho_arquivo: req.file.path
            };
            await Trabalho.upsertEntrega(dadosEntrega);
            res.status(201).json({ message: "Arquivo enviado com sucesso!", file: req.file });
        } catch (err) { next(err); }
    },

    // --- FUNÇÕES DA PÁGINA DE DEFINIR ORIENTADOR ---

    solicitarOrientador: async (req, res, next) => {
        try {
            const idAluno = 2;
            const { id_orientador } = req.body;

            const trabalho = await Trabalho.findByAlunoId(idAluno);
            if (!trabalho) return res.status(404).json({ message: "Trabalho do aluno não encontrado." });
            
            await Trabalho.definirOrientador(trabalho.id_trabalho, id_orientador);
            res.status(200).json({ message: "Orientador solicitado com sucesso!" });
        } catch (err) { next(err); }
    },
};

module.exports = trabalhoController;