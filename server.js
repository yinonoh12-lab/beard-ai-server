import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use((req, res, next) => {
  if (req.headers.authorization !== "Bearer MY_SECRET_123") {
    return res.status(401).send("Unauthorized");
  }
  next();
});

app.post("/analyze", async (req, res) => {
  try {
    const { images, style } = req.body;

    const content = [
      { type: "text", text: `תן מדריך זקן עבור ${style}` },
      ...images.map(img => ({
        type: "image_url",
        image_url: { url: img }
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content }]
    });

    res.json({ result: response.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));
