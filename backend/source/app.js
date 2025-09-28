const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const alunoRoutes = require("./routes/alunoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const trabalhoRoutes = require("./routes/trabalhoRoutes");
//const avaliacaoBancaRoutes = require("./routes/avaliacaoBancaRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bancaRoutes = require("./routes/bancaRoutes");
const errorHandler = require("./middlewares/errorHandler");
const coordRoutes = require("./routes/coordRoutes");

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// passa o router importado
app.use("/alunos", alunoRoutes);
app.use("/cursos", cursoRoutes);
app.use("/professores", professorRoutes);
app.use("/trabalhos", trabalhoRoutes);
//app.use("/avaliacoes", avaliacaoBancaRoutes);
app.use("/banca", bancaRoutes)
//app.use('/users', userRoutes);
app.use("/coordenador", coordRoutes);


app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.get("/ping", (req, res) => res.json({ message: "pong 🏓" }));

// sempre depois das rotas
app.use(errorHandler);

module.exports = app;