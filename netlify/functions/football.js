// Ponte entre o site e a football-data.org.
// Isso roda no servidor da Netlify (de graça), então a sua chave de API
// nunca aparece para quem visita o site.

exports.handler = async function (event) {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "FOOTBALL_API_KEY não configurada. Adicione a variável de ambiente nas configurações do site na Netlify.",
      }),
    };
  }

  // ?path=matches?dateFrom=2026-08-03&dateTo=2026-08-03&competitions=PL,BSA
  const path = event.queryStringParameters.path;

  if (!path) {
    return { statusCode: 400, body: JSON.stringify({ error: "Parâmetro 'path' ausente." }) };
  }

  const url = `https://api.football-data.org/v4/${path}`;

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": API_KEY },
    });
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Falha ao buscar dados.", details: String(err) }),
    };
  }
};
