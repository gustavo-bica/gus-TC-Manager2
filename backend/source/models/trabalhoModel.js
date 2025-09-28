// source/models/trabalhoModel.js

const db = require("../database/connection");

const Trabalho = {
  
  create: async (trabalhoData) => {
    const { titulo, resumo, id_aluno, id_orientador, id_status } = trabalhoData;
    const query = "INSERT INTO TRABALHOS (titulo, resumo, id_aluno, id_orientador, id_status) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(query, [titulo, resumo, id_aluno, id_orientador, id_status]);
    return result;
  },

  getAll: async () => {
    const query = `
      SELECT T.id_trabalho, T.titulo, A.nome AS nome_aluno, O.nome AS nome_orientador, S.descricao AS status
      FROM TRABALHOS AS T
      JOIN USUARIOS AS A ON T.id_aluno = A.id_usuario
      JOIN USUARIOS AS O ON T.id_orientador = O.id_usuario
      JOIN STATUS_TRABALHO AS S ON T.id_status = S.id_status
      ORDER BY T.id_trabalho;
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  findById: async (id) => {
    const query = "SELECT * FROM TRABALHOS WHERE id_trabalho = ?";
    const [rows] = await db.execute(query, [id]);
    return rows[0]; // Retorna o primeiro resultado ou undefined
  },

  findByAlunoId: async (idAluno) => {
    const query = "SELECT * FROM TRABALHOS WHERE id_aluno = ?";
    const [rows] = await db.execute(query, [idAluno]);
    return rows[0];
  },

  update: async (id, trabalhoData) => {
    const { titulo, resumo, id_status } = trabalhoData;
    const query = "UPDATE TRABALHOS SET titulo = ?, resumo = ?, id_status = ? WHERE id_trabalho = ?";
    const [result] = await db.execute(query, [titulo, resumo, id_status, id]);
    return result;
  },

  delete: async (id) => {
    const query = "DELETE FROM TRABALHOS WHERE id_trabalho = ?";
    const [result] = await db.execute(query, [id]);
    return result;
  },
  
  updateLink: async (idTrabalho, link) => {
    const query = "UPDATE TRABALHOS SET link_repositorio = ? WHERE id_trabalho = ?";
    const [result] = await db.execute(query, [link, idTrabalho]);
    return result;
  },

  createEntrega: async (dadosEntrega) => {
    const query = "INSERT INTO ENTREGAS (id_trabalho, id_etapa, data_prevista, data_entrega, caminho_arquivo) VALUES (?, ?, ?, ?, ?)";
    const params = [
        dadosEntrega.id_trabalho,
        dadosEntrega.id_etapa,
        dadosEntrega.data_prevista,
        dadosEntrega.data_entrega,
        dadosEntrega.caminho_arquivo
    ];
    const [result] = await db.execute(query, params);
    return result;
  },
  upsertEntrega: async (dadosEntrega) => {
    const { id_trabalho, id_etapa, data_prevista, data_entrega, caminho_arquivo } = dadosEntrega;

    // 1. Verifica se já existe uma entrega para este trabalho e esta etapa
    const selectQuery = "SELECT id_entrega FROM ENTREGAS WHERE id_trabalho = ? AND id_etapa = ?";
    const [existingRows] = await db.execute(selectQuery, [id_trabalho, id_etapa]);

    if (existingRows.length > 0) {
      // 2. Se EXISTE: Atualiza o registro existente com o novo caminho do arquivo e a nova data
      console.log(`Atualizando entrega existente para o trabalho ${id_trabalho} e etapa ${id_etapa}`);
      const updateQuery = "UPDATE ENTREGAS SET data_entrega = ?, caminho_arquivo = ? WHERE id_trabalho = ? AND id_etapa = ?";
      const [result] = await db.execute(updateQuery, [data_entrega, caminho_arquivo, id_trabalho, id_etapa]);
      return result;
    } else {
      // 3. Se NÃO EXISTE: Cria um novo registro
      console.log(`Criando nova entrega para o trabalho ${id_trabalho} e etapa ${id_etapa}`);
      const insertQuery = "INSERT INTO ENTREGAS (id_trabalho, id_etapa, data_prevista, data_entrega, caminho_arquivo) VALUES (?, ?, ?, ?, ?)";
      const [result] = await db.execute(insertQuery, [id_trabalho, id_etapa, data_prevista, data_entrega, caminho_arquivo]);
      return result;
    }
  }
};

module.exports = Trabalho;