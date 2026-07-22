import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;
