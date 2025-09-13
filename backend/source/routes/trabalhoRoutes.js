const express = require("express");
const router = express.Router();
const trabalhoController = require("../controllers/trabalhoController");

router.get("/", trabalhoController.listarTrabalhos);
router.get("/:id", trabalhoController.getById);
router.post("/", trabalhoController.create);
router.put("/:id", trabalhoController.update);
router.delete("/:id", trabalhoController.delete);

module.exports = router;