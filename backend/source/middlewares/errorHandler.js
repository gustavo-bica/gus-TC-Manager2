// Em source/middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
    // Define valores padrão para as propriedades do erro
    const status = err.status || 500;
    const message = err.message || "Erro interno do servidor.";
    const code = err.code || "INTERNAL_ERROR";
    const level = err.level || "error"; // Pega o 'level' do erro ou usa 'error' como padrão

    // Agora você pode usar 'level' com segurança para registrar o log
    console.error(`[ERRO CAPTURADO] - Nível: ${level.toUpperCase()} | Código: ${code} | Mensagem: ${message}`);
    
    // Envia uma resposta JSON padronizada para o frontend
    res.status(status).json({
        level: level,
        code: code,
        message: message
    });
};