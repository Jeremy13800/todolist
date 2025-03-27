import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

// Servir les fichiers statiques de l'application REACT build
app.use(express.static("dist"));

// Middleware pour analyser les corps JSON des requêtes
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let tasksCollection;

async function startServer() {
  try {
    await client.connect();
    console.log("client connecté");
    tasksCollection = client.db(process.env.MONGO_DB).collection("tasks"); // Ajoute .collection("tasks")
    console.log("✅ Connexion MongoDB établie");
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err);
  }
}

startServer(); // N'oublie pas d'appeler la fonction

// Logger middleware pour logger chaque requête
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("↖️  req.body: ");
  console.log(req.body);
  const oldSend = res.send;
  res.send = function (data) {
    console.log("↘️ ", `Status: ${res.statusCode}`);
    if (data) console.log(JSON.parse(data));
    oldSend.call(this, data);
  };
  next();
});

// Opérations CRUD

// GET : Récupérer toutes les tâches
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray(); // Récupérer tous les documents
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Échec de la récupération des tâches." });
  }
});

// POST : Créer une nouvelle tâche
app.post("/api/tasks", async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    // TODO A compléter
    const result = await tasksCollection.insertOne(req.body);
    const createdTask = await tasksCollection.findOne({
      _id: result.insertedId,
    });
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: "Échec de la création de la tâche." });
  }
});

// PUT : Mettre à jour une tâche par ID
app.put("/api/tasks/:id", async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);
    // TODO A compléter
    const result = await tasksCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: "after" }
    );
    res.json(result.value);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE : Supprimer une tâche par ID
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);
    // TODO A compléter
    const result = await tasksCollection.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    res.json(result.value);
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(400).json({ message: error.message });
  }
});

// Rediriger toutes les autres requêtes vers index.html pour la gestion du routage côté client
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Démarrer le serveur et écouter sur le port configuré

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} via http://localhost:${PORT}`);
});
