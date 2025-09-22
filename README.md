# API de Scraping de Resultados de Animalitos

Este proyecto es una API en Node.js con Express que realiza scraping de la página de TuAzar para obtener resultados de loterías de Animalitos.

## Características

- Obtiene imagen del animal, nombre, hora de salida y número.
- Muestra hasta 12 resultados por lotería, separadas por título.
- Si no hay resultados del día actual, muestra los del día anterior.
- Devuelve datos en formato JSON.
- Estructura organizada en carpetas: routes, controllers, services.
- Usa axios para peticiones HTTP y cheerio para parsear HTML.
- Incluye headers y User-Agent para evitar bloqueos.
- Soporta CORS para consumo desde cualquier origen.

## Instalación

1. Clona o descarga el proyecto.
2. Ejecuta `npm install` para instalar dependencias.

## Ejecución

Ejecuta `npm start` para iniciar el servidor en http://localhost:3002.

Para desarrollo, usa `npm run dev` (requiere nodemon).

## Estructura del Proyecto

- `index.js`: Punto de entrada del servidor.
- `routes/results.js`: Definición de rutas.
- `controllers/resultsController.js`: Lógica de controladores.
- `services/scraperService.js`: Servicio de scraping.
- `views/`: Plantillas EJS (no utilizadas en API, pero presentes).

## Notas sobre Scraping

- Los selectores en `scraperService.js` están ajustados según la estructura HTML de la página (https://www.tuazar.com/loteria/animalitos/resultados/).
- Se incluyen headers para simular un navegador y evitar bloqueos.
- Respeta los tiempos de renderizado con timeout configurado.

## Endpoints

- `GET /api/`: Devuelve los resultados en JSON.

### Ejemplo de Respuesta

```json
{
  "lotteries": [
    {
      "lotteryName": "Nombre de la Lotería",
      "results": [
        {
          "image": "https://...",
          "name": "Animal",
          "time": "14:30",
          "number": "89"
        }
      ]
    }
  ],
  "isToday": true,
  "title": "Resultados del Día"
}
```

## Despliegue

### En GitHub

1. Crea un repositorio en GitHub.
2. Sube los archivos del proyecto (excluye `node_modules/` usando `.gitignore`).
3. Para despliegue gratuito, usa plataformas como Vercel o Railway.

### Vercel

1. Conecta tu repo de GitHub a Vercel.
2. Configura el build command: `npm run build` (si aplica, pero para Node.js puro, usa el start script).
3. Vercel detectará automáticamente el proyecto Node.js.

### Railway

1. Conecta tu repo de GitHub a Railway.
2. Railway detectará el `package.json` y desplegará automáticamente.

Asegúrate de que el puerto sea `process.env.PORT` para compatibilidad con plataformas de despliegue.

## Dependencias

- express: Framework web.
- axios: Cliente HTTP.
- cheerio: Parser HTML.
- cors: Soporte para CORS.
- ejs: Motor de plantillas (no utilizado en API).# end-point-resultados
