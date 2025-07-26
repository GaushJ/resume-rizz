import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Proxy endpoint for OpenAI API
app.post("/api/openai", async (req, res) => {
  try {
    const { apiKey, model, messages, temperature, maxTokens } = req.body;
    console.log(
      `OpenAI request - Model: ${model}, Messages: ${messages.length}`
    );

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("OpenAI proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Proxy endpoint for Anthropic API
app.post("/api/anthropic", async (req, res) => {
  try {
    const { apiKey, model, messages, temperature, maxTokens } = req.body;
    console.log(
      `Anthropic request - Model: ${model}, Messages: ${messages.length}`
    );

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages,
        temperature,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Anthropic proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
