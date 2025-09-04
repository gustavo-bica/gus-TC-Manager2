const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const alunoRoutes = require("./routes/alunoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const trabalhoRoutes = require("./routes/trabalhoRoutes");
const avaliacaoBancaRoutes = require("./routes/avaliacaoBancaRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bancaRoutes = require("./routes/bancaRoutes");

app.use(bodyParser.json());

// passa o router importado
app.use("/alunos", alunoRoutes);
app.use("/cursos", cursoRoutes);
app.use("/professores", professorRoutes);
app.use("/trabalhos", trabalhoRoutes);
app.use("/avaliacoes", avaliacaoBancaRoutes);

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", bancaRoutes);

app.get("/ping", (req, res) => res.json({ message: "pong 🏓" }));

module.exports = app;