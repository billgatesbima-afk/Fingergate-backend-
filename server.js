import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

app.get("/", (req, res) => {
    res.send("Fingergate API OK");
});

const users = new Map();

app.post("/register", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });
    users.set(email, { email });
    res.json({ ok: true });
});

app.post("/auth/biometric", (req, res) => {
    const { email, deviceProof } = req.body;

    if (!users.has(email)) {
        return res.status(401).json({ error: "Utilisateur inexistant" });
    }

    if (deviceProof !== "LOCAL_AUTH_OK") {
        return res.status(403).json({ error: "Preuve invalide" });
    }

    const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
});

app.listen(PORT, () => {
    console.log("Fingergate API running on port " + PORT);
});
