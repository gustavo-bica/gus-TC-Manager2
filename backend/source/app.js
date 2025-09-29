const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');      
const path = require('path');  

const app = express();

// --- LÓGICA DE SETUP INICIAL ---
// Garante que a pasta 'uploads' exista antes de o servidor começar a usá-la.
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Pasta "uploads" criada com sucesso.');
}

// --- MIDDLEWARES GLOBAIS ---
// Configuração do CORS para permitir todos os métodos HTTP (PUT, DELETE, etc.)
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(bodyParser.json());
// Torna a pasta 'uploads' publicamente acessível pela URL /uploads
app.use('/uploads', express.static('uploads'));


// --- IMPORTAÇÃO DAS ROTAS ---
const alunoRoutes = require("./routes/alunoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const trabalhoRoutes = require("./routes/trabalhoRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bancaRoutes = require("./routes/bancaRoutes");
const errorHandler = require("./middlewares/errorHandler");
const coordRoutes = require("./routes/coordRoutes");
const orientadoRoutes = require("./routes/orientadorRoutes");

// --- REGISTRO DAS ROTAS ---
app.use("/alunos", alunoRoutes);
app.use("/cursos", cursoRoutes);
app.use("/professores", professorRoutes);
app.use("/trabalhos", trabalhoRoutes);
app.use("/banca", bancaRoutes);
app.use("/coordenador", coordRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/coordenador', require('./routes/coordRoutes'));
app.use("/orientador", orientadoRoutes);

// Rota de teste
app.get("/ping", (req, res) => res.json({ message: "pong 🏓" }));

// Middleware de tratamento de erros (sempre por último)
app.use(errorHandler);

module.exports = app;