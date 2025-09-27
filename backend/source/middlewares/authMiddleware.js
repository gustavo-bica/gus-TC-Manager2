const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // pega o conteúdo depois de "Bearer "

    if (!token) {
        return res.status(401).json({ error: "Token inválido "});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // coloca a informação do user no req
        next(); // segue para a rota
    } catch (err) {
        return res.status(403).json({ error: "Token expirado ou inválido" });
    }
}

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.tipo;
        
        if (allowedRoles.includes(userRole)) {
            next(); // o usuário tem permissão -> pode seguir para a rota
        } else {
            res.status(403).json({error: "Acesso negado. Você não tem permissão para acessar este recurso."})
        }
    }
}

module.exports = {
    authMiddleware,
    authorize
};