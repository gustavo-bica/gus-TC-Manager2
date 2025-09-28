const multer = require('multer');
const path = require('path');

// Define onde os arquivos serão armazenados
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // IMPORTANTE: Crie uma pasta chamada 'uploads' na raiz da sua pasta 'backend'
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Garante que cada arquivo tenha um nome único adicionando a data
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;