module.exports = (err, req, res, next) => {  
    console.error("Erro capturado pelo middleware: ", err);

    const status = err.status || 500;   // código de status (default = 500)
    const code = err.code || "INTERNAL_ERROR";  // código padronizado
    const message = err.level|| (status >= 500 ? "error" : "warning");  // regra default

    res.status(status).json({
        sucess: false,
        code,
        level,  // "warning" ou "error"
        message: err.message || "Erro interno do servidor."
    });
};