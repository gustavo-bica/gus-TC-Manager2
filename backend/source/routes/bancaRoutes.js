const express = require("express");
const router = express.Router();
const db = require("../config/db");

// rota para listar trabalhos com banca
router.get("/bancas", async (req, res) => {
    try {
        const [rows] = await db.query (`
            SELECT
                t.id_trabalho,
                a.nome AS aluno,
                o.nome AS orientador,
                GROUP_CONCAT(DISTINCT p.nome SEPARATOR ', ') AS banca,
                t.nota_final AS nota
            FROM TRABALHOS t
            JOIN USUARIOS a ON t.id_aluno = a.id_usuario
            JOIN USUARIOS o ON t.id_orientador = o.id_usuario
            JOIN BANCA_AVALIADORA b on t.id_trabalho = b.id_trabalho
            JOIN USUARIOS p ON b.id_professor = p.id_usuario
            GROUP BY t.id_trabalho, a.nome, o.nome, t.nota_final;
            `);

            res.json(rows);

    } catch (err) {
        console.error("Erro ao buscar bancas", err);
        res.status(500).json({ error: "Erro ao buscar bancas." });
    }
});

module.exports = router;

/* PARA ATUALIZAR A TABELA, CHAMAR NOVAMENTE A ROTA DO BACKEND

------ sugestão de código para o script no frontend:
async function carregarTabelaBancas() {
    try {
        const response = await fetch("http://localhost:3000/bancas");
        const bancas = await response.json();

        const tbody = document.querySelector("#tabelaBancas tbody");
        tbody.innerHTML = "";

        bancas.forEach(b => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${b.banca}</td>
                <td>${b.aluno}</td>
                <td>${b.orientador}</td>
                <td>${b.nota ?? "-"}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro ao carregar bancas:", err);
    }
}

*/