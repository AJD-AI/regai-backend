require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  console.log("📨 Received question:", question);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: question }],
    });

    console.log("🧠 OpenAI response:", JSON.stringify(chatCompletion, null, 2));

    const answer = chatCompletion.choices?.[0]?.message?.content?.trim() || "No answer received.";
    res.json({ answer });
  } catch (error) {
    console.error("🔥 OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI.", details: error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ RegAI backend running on port 3000");
});
