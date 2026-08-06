// Responde perguntas sobre futebol usando a API gratuita do Google Gemini.
// A chave fica escondida no servidor (variável de ambiente), nunca aparece pro visitante.

exports.handler = async function (event) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GEMINI_API_KEY não configurada nas variáveis de ambiente da Netlify.",
      }),
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Use POST." }) };
  }

  let question;
  try {
    question = JSON.parse(event.body || "{}").question;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Corpo inválido." }) };
  }

  if (!question || question.length > 500) {
    return { statusCode: 400, body: JSON.stringify({ error: "Pergunta ausente ou muito longa." }) };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Você é o assistente do site Apito, sobre futebol. Responda em português do Brasil, " +
                  "de forma direta e curta (no máximo 4 frases), focado em futebol. " +
                  "Se não souber algo com certeza (como resultado de um jogo bem recente), diga isso claramente " +
                  "ao invés de inventar.\n\nPergunta do usuário: " + question,
              },
            ],
          },
        ],
      }),
    });

    const data = await res.json();
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não consegui gerar uma resposta agora. Tenta de novo em instantes.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Falha ao consultar a IA.", details: String(err) }) };
  }
};
