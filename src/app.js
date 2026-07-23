import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

export default app;
