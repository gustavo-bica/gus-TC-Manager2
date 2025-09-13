require("dotenv").config();
const mysql = require("mysql2/promise");

const conn = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'tc-manager',
  port: 3306,
});

if (conn) {
  console.log("Deu");
} else {
  console.log("Não deu");
}

module.exports = conn;

/* LISTA DE CÓDIGOS DE ERRO

DB_CONNECTION_ERROR → Erro de conexão com o banco de dados.
INTERNAL_ERROR → Erro interno genérico (fallback).
VALIDATION_ERROR → Erro de validação (faltando campos obrigatórios).
FORBIDDEN_ACTION → Usuário não tem permissão para executar a ação.

*/ 