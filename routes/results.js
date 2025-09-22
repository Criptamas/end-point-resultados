const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/resultsController");

/**
 * Rutas para los resultados de Animalitos.
 * Define el endpoint principal que muestra los resultados.
 */

// Ruta principal: GET /
router.get("/", resultsController.getResults);

module.exports = router;
