const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Servicio para hacer scraping de resultados de Animalitos.
 * Utiliza axios para las peticiones HTTP y cheerio para parsear el HTML.
 * Incluye headers para simular un navegador y evitar bloqueos.
 */
class ScraperService {
  constructor() {
    // Configuración de axios con headers para evitar bloqueos
    this.axiosConfig = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 10000, // Timeout de 10 segundos
    };
  }

  /**
   * Obtiene los resultados de la página especificada.
   * @param {string} url - URL de la página a scrapear.
   * @returns {Array} Lista de loterías con sus resultados filtrados por hora (8:00 am - 19:00 pm).
   */
  async scrapeResults(url) {
    try {
      // Hacer la petición HTTP con headers
      const response = await axios.get(url, this.axiosConfig);
      const $ = cheerio.load(response.data);

      // Basado en la estructura HTML proporcionada, extraer de cada lotería
      const lotteries = [];
      const selector = url.includes("ayer")
        ? ".resultados"
        : ".col-md-8.col-sm-12.resultados";
      $(selector).each((index, lotteryElement) => {
        const $lottery = $(lotteryElement);
        // Nombre de la lotería
        const lotteryName = $lottery.find("h2.lotResTit").text().trim();

        const results = [];
        // Iterar sobre cada fila de resultados
        $lottery.find(".row.resultado").each((rowIndex, rowElement) => {
          const $row = $(rowElement);
          // Iterar sobre cada animalito en la fila
          $row.find(".col-xs-6.col-sm-3").each((animalIndex, animalElement) => {
            const $animal = $(animalElement);

            // Extraer imagen
            const image = $animal.find("img.img-responsive").attr("src");
            // Extraer nombre y número del alt o span
            const altText =
              $animal.find("img.img-responsive").attr("alt") ||
              $animal.find("span").first().text().trim();
            // altText es como "89 - ANGUILA"
            const [number, name] = altText.split(" - ").map((s) => s.trim());
            // Extraer hora
            const time = $animal.find(".horario span").text().trim();

            // Agregar resultado (sin filtro de hora para asegurar 12 por lotería)
            results.push({
              image: image ? "https:" + image : "", // Agregar https si falta
              name,
              time,
              number,
            });
          });
        });

        // Agregar la lotería si tiene resultados
        if (results.length > 0) {
          lotteries.push({
            lotteryName,
            results: results.slice(0, 12), // Limitar a 12 resultados por lotería
          });
        }
      });

      return lotteries;
    } catch (error) {
      console.error("Error al scrapear:", error.message);
      throw new Error("No se pudieron obtener los resultados.");
    }
  }

  /**
   * Verifica si la hora está dentro del rango 8:00 am - 19:00 pm.
   * @param {string} time - Hora en formato como '14:30' o '2:30 pm'.
   * @returns {boolean} True si está en rango.
   */
  isWithinTimeRange(time) {
    // Parsear hora, manejando AM/PM
    const timeStr = time.toLowerCase().trim();
    const isPM = timeStr.includes("pm");
    const isAM = timeStr.includes("am");
    let cleanTime = timeStr.replace(/am|pm/g, "").trim();
    let [hours, minutes] = cleanTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return false; // Si no se puede parsear, excluir
    if (isPM && hours !== 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 8 * 60; // 8:00
    const endMinutes = 19 * 60; // 19:00
    return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
  }

  /**
   * Obtiene resultados del día actual. Si no hay, obtiene del día anterior.
   * @returns {Object} { lotteries: Array, isToday: boolean }
   */
  async getResults() {
    const todayUrl = "https://www.tuazar.com/loteria/animalitos/resultados/";
    const yesterdayUrl =
      "https://www.tuazar.com/loteria/animalitos/resultados/ayer/";

    let lotteries = await this.scrapeResults(todayUrl);
    let isToday = true;

    if (lotteries.length === 0) {
      // Si no hay resultados del día actual, obtener del día anterior
      lotteries = await this.scrapeResults(yesterdayUrl);
      isToday = false;
    }

    return { results: lotteries, isToday };
  }
}

module.exports = new ScraperService();
