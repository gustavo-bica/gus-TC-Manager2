const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");

// armazenamento de tokens temporários (ideial seria na tabela do BD)
let resetTokens = {};

// LOGIN
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    console.log("📩 Dados recebidos no login:", req.body);

    if (!email || !password) {
        const err = new Error("Email e senha são obrigatórios!");
        err.status = 400;
        err.code = "AUTH_MISSING_CREDENTIALS";
        err.level = "warning";  // 🟡 alerta amarelo
        return next(err);
    }

    try {
        // buscar o user pelo email
        const [rows] = await db.query("SELECT * FROM USUARIOS WHERE email = ?", [email]);

        if (rows.length === 0) {
            const err = new Error("Credenciais inválidas!");
            err.status = 401;
            err.code = "AUTH_INVALID_CREDENTIALS";
            err.level = "error"; // 🔴 alerta vermelho
            return next(err);
        }

        const usuario = rows[0];

        console.log("🔍 Objeto 'usuario' recuperado do banco:", usuario);

        const hashDoBanco = String(usuario.tx_senha);

        // confere a senha (precisa adicionar uma coluna para isso no db)
        const senhaCorreta = await bcrypt.compare(password, hashDoBanco);
        if (!senhaCorreta) {
            const err = new Error("Credenciais inválidas!");
            err.status = 401;
            err.code = "AUTH_INVALID_CREDENTIALS";
            err.level = "error";    // 🔴 alerta vermelho
            return next(err);
        }

        // traduz o id do tipo de usuário para um "nome de perfil"
        let tipoUsuario = '';
        switch (usuario.id_tipo_usuario) {
            case 1: tipoUsuario = 'aluno'; break;
            case 2: tipoUsuario = 'professor'; break;
            case 3: tipoUsuario = 'coordenador'; break;
            default: tipoUsuario = 'desconhecido';
        }

        // gera o token
        const tokenPayload = {
            id: usuario.id_usuario,
            email: usuario.email,
            tipo: tipoUsuario
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login bem-sucedido!",
            token: token,
            user: {
                nome: usuario.nome,
                tipo: tipoUsuario
            }
        });

    } catch (err) {
        console.error("Erro no login:", err);
        err.status = 500;
        err.code = "AUTH_LOGIN_ERROR";
        err.level = "error";    // 🔴 alerta vermelho
        next(err);
    }

};


// REGISTER
exports.register = async (req, res) => {
    const { nome, email, password, id_tipo_usuario, id_curso } = req.body;

    if (!email || !password || !id_tipo_usuario) {
        const err = new Error("Nome, email, senha e tipo de usuários são obrigatórios!");
        err.status = 400;
        err.code = "AUTH_REGISTER_MISSING_FIELDS";
        err.level = "warning";  // 🟡 alerta amarelo
        return next(err);
    }

    try {
        // gera o hash da senha
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        // insere no banco
        const [result] = await db.query(
            "INSERT INTO USUARIOS (nome, email, senha, id_tipo_usuario, id_curso) VALUES (?, ?, ?, ?, ?)",
            [nome, email, hash, id_tipo_usuario, id_curso || null]
        );

        return res.status(201).json({
            message: "Usuário registrado com sucesso!",
            id_usuario: result.insertId,
            email
        });


    } catch (err) {
        err.status = 500;
        err.code = "AUTH_REGISTER_ERROR";
        err.level = "error";    // 🔴 alerta vermelho
        next(err);
    }
};

// REDEFINIR SENHA
exports.redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
        const err = new Error("Token e nova senha são obrigatórios!");
        err.status = 400;
        err.code = "PASSWORD_RESET_MISSING_FIELDS";
        err.level = "warning";  // 🟡 alerta amarelo
        return next(err);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // valida o token

        // confere se ainda é válido em memória
        if (!resetTokens[decoded.email] || resetTokens[decoded.email] !== token) {
            const err = new Error("Token inválido ou expirado!");
            err.status = 400;
            err.code = "PASSWORD_RESET_TOKEN_INVALID";
            err.level = "error";   // 🔴 alerta vermelho
            return next(err);
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(novaSenha, saltRounds);

        await db.query("UPDATE USUARIOS SET senha = ? WHERE email = ?", [hash, decoded.email]);

        // remove o token da lista
        delete resetTokens[decoded.email];

        return res.json({ message: "Senha redefinida com sucesso!" });

    } catch (err) {
        err.status = 500;
        err.code = "PASSWORD_RESET_ERROR";
        err.level = "error";    // 🔴 alerta vermelho
        next(err);
    }
};

// ESQUECI A SENHA
exports.esqueciSenha = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        const err = new Error("Email é obrigatório!");
        err.status = 400;
        err.code = "PASSWORD_EMAIL_MISSING";
        err.level = "warning";  // 🟡 alerta amarelo
        return next(err);
    }

    try {
        // verifica se o usuário existe
        const [rows] = await db.query("SELECT * FROM USUARIOS WHERE email = ?", [email]);

        if (rows.length === 0) {
            const err = new Error("Email não encontrado!");
            err.status = 404;
            err.code = "PASSWORD_EMAIL_NOT_FOUND";
            err.level = "error";    // 🔴 alerta vermelho
            return next(err);
        }

        const usuario = rows[0];
        
        // gera token temporário
        const token = jwt.sign(
            { id: usuario.id_usurio, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "10m" } // expira em 10 minutos
        );

        // salva o token na memória
        resetTokens[email] = token;

        // link para redefinir (TODO: ajustar para o endereço correto do front)
        const resetLink = `${process.env.FRONTEND_URL}/reset-passoword?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // monta o email e envia
        await transporter.sendMail({
            from: `"Suporte TC-Manager <${process.env.EMAIL_USER}>`,
            to: usuario.email,
            subject: "Redefinição de Senha",
            html: `
            <h3>Redefinição de Senha</h3>
            <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este link expira em 10 minutos.</p>
            `
        });

        return res.json({ message: "Email de redefinição enviado!" });

    } catch (err) {
        err.status = 500;
        err.code = "PASSWORD_EMAIL_ERROR";
        err.level = "error";    // 🔴 alerta vermelho
        next(err);
    }
};

/* LISTA DE CÓDIGOS DE ERRO

AUTH_INVALID_CREDENTIALS → Email ou senha inválidos no login.
AUTH_TOKEN_EXPIRED → Token JWT expirado.
AUTH_TOKEN_INVALID → Token inválido ou malformado.

PASSWORD_RESET_TOKEN_INVALID → Token de redefinição inválido.
PASSWORD_RESET_TOKEN_EXPIRED → Token de redefinição expirado.
PASSWORD_RESET_ERROR → Erro ao redefinir senha.
PASSWORD_EMAIL_ERROR → Erro ao enviar email de redefinição.

*/