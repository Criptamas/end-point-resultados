const scraperService = require("../services/scraperService");

/**
 * Controlador para manejar las rutas de resultados.
 * Obtiene datos del servicio de scraping y los pasa a la vista.
 */
class ResultsController {
  /**
   * Maneja la solicitud para mostrar resultados.
   * Obtiene resultados del día actual o anterior y renderiza la vista.
   */
  async getResults(req, res) {
    try {
      // Obtener resultados usando el servicio de scraping
      const { results: lotteries, isToday } = await scraperService.getResults();

      // Verificar si no hay resultados
      if (lotteries.length === 0) {
        return res.json({
          message: "No hay resultados disponibles",
          isToday,
          title: isToday ? "Resultados del Día" : "Resultados del Día Anterior",
        });
      }

      // Devolver JSON con los datos
      res.json({
        lotteries,
        isToday,
        title: isToday ? "Resultados del Día" : "Resultados del Día Anterior",
      });
    } catch (error) {
      // En caso de error, devolver JSON de error
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResultsController();
