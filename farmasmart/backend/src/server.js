const express = require("express");
const cors    = require("cors");
const api     = require("./routes/api");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", api);

app.get("/", (_, res) => res.json({ status: "ok", app: "FarmaSmart API" }));
app.use((_, res) => res.status(404).json({ erro: "Rota não encontrada." }));

app.listen(PORT, () => console.log(`FarmaSmart API em http://localhost:${PORT}`));
