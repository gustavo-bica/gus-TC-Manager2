require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// caminho cross-platform pro arquivo .pem
const certPath = path.join(__dirname, "certs", "ca.pem");

console.log("Usando certificado em:", certPath);
console.log("Tentando conectar com:");
console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.DB_PORT);
console.log("USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(certPath).toString(),
    rejectUnauthorized: false
  },
  connectTimeout: 20000
});

(async () => {
  try {
    console.log("Tentando pegar conexão...");
    const conn = await pool.getConnection();
    console.log("Conexão com MySQL estabelecida!");
    conn.release();
  } catch (err) {
    console.error("Erro ao conectar ao MySQL: ", err);

    // log detalhado pra depuração
    if (err.code === 'ETIMEDOUT') {
      console.error("→ Possível problema de rede ou firewall. Confirme se o seu IP está liberado no Aiven.");
    }
    if (err.code === 'ECONNREFUSED') {
      console.error("→ Conexão recusada. Cheque se host/porta estão corretos e se o banco está aceitando SSL.");
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("→ Usuário ou senha incorretos. Confirme DB_USER e DB_PASSWORD no .env");
    }
  }
})();

module.exports = pool;
