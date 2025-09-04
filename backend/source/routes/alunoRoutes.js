const express = require("express");
const router = express.Router();
const db = require("../config/db");

// rota para listar os alunos e seus trabalhos
router.get("/alunos", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                a.nome AS aluno,
                o.nome AS orientador,
                s.descricao AS status
                CONCAT(
                    (SELECT COUNT(*) FROM BANCA_AVALIADORA ba WHERE ba.id_trabalho = t.id_trabalho),
                    '/2'
                ) AS banca
            FROM TRABALHOS t
            JOIN USUARIOS a ON t.id_aluno = a.id_usuario
            JOIN USUARIOS o ON t.id_orientador = o.id_usuario
            JOINT STATUS_TRABALHO s ON t.id_status = s.id_status
            `);

        res.json(rows);

    } catch (err) {
        console.error("Erro ao buscar alunos: ", err);
        res.status(500).json({ erro: "Erro ao buscar alunos." });
    }
});

module.exports = router;

/* SUGESTÃO DE CÓDIGO PARA O SCRIPT NO FRONTEND

<table id="tabelaAlunos" class="table">
  <thead>
    <tr>
      <th>Aluno</th>
      <th>Orientador</th>
      <th>Status</th>
      <th>Banca</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<script>
async function carregarTabelaAlunos() {
    try {
        const response = await fetch("http://localhost:3000/alunos");
        const alunos = await response.json();

        const tbody = document.querySelector("#tabelaAlunos tbody");
        tbody.innerHTML = "";

        alunos.forEach(a => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${a.aluno}</td>
                <td>${a.orientador}</td>
                <td>${a.status}</td>
                <td>${a.banca}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro ao carregar alunos:", err);
    }
}

*/