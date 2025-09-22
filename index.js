const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// Configurar motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Rutas
const resultsRoutes = require("./routes/results");
app.use("/api", resultsRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
