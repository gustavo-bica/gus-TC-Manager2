const express = require("express");
const router = express.Router();
const bancaController = require("../controllers/bancaController"); 

/* debug
console.log("bancaController keys:", Object.keys(bancaController || {}));
*/

// rota para listar trabalhos com banca
router.get("/", bancaController.listarBanca);

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