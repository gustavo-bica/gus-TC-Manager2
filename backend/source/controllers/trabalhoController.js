const Trabalho = require("../models/trabalhoModel");
const Desenvolvimento = require("../models/desenvolvimentoModel");

// Garantimos que estamos exportando um objeto com todas as funções
const trabalhoController = {

    // ESTA É A FUNÇÃO QUE ESTAVA FALTANDO OU COM NOME ERRADO
    getDadosPaginaDesenvolvimento: async (req, res, next) => {
        try {
            const idAluno = 2; // ID fixo para teste

            const dadosPrincipais = await Desenvolvimento.getDadosPrincipais(idAluno);
            if (!dadosPrincipais) {
                return res.status(404).json({ message: "Nenhum trabalho encontrado para este aluno." });
            }

            const registros = await Desenvolvimento.getRegistros(dadosPrincipais.id_trabalho);

            const resposta = {
                dadosPrincipais: dadosPrincipais,
                infoParticipantes: {
                    orientador: {
                        nome: dadosPrincipais.nome_orientador,
                        email: dadosPrincipais.email_orientador,
                    },
                    banca: dadosPrincipais.membros_banca ? dadosPrincipais.membros_banca.split(', ') : [],
                },
                registros: registros
            };
            res.status(200).json(resposta);

        } catch (err) {
            console.error("Erro ao buscar dados de desenvolvimento:", err);
            next(err);
        }
    },

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
        } catch (err) {
            console.error("Erro ao atualizar link:", err);
            next(err);
        }
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
        } catch (err) {
            console.error("Erro no upload:", err);
            next(err);
        }
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
                status: 'Realizada' // <-- LINHA QUE FALTAVA
            };

            await Desenvolvimento.createRegistro(novoRegistro);
            res.status(201).json({ message: "Registro criado com sucesso!" });
        } catch (err) {
            console.error("Erro ao criar registro:", err);
            next(err);
        }
    }
};
exports.createRegistro = async (req, res, next) => {
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
            status: 'Realizada' // <-- LINHA QUE FALTAVA
        };

        // Agora passamos o objeto completo para o model
        await Desenvolvimento.createRegistro(novoRegistro);
        res.status(201).json({ message: "Registro criado com sucesso!" });
    } catch (err) {
        console.error("Erro ao criar registro:", err);
        next(err);
    }
};
module.exports = trabalhoController;