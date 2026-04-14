const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Configuración CORS
app.use(
  cors({
    origin: "http://localhost:5173", // puerto de Vite
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

const routes = require("./routes/methodsRoutes");
app.use("/api", routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});