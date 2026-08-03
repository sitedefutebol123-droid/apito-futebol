// Confirma com a Stripe (no servidor, sem expor sua chave secreta)
// se uma sessão de pagamento foi realmente paga, antes de liberar o Premium.

exports.handler = async function (event) {
  const SECRET = process.env.STRIPE_SECRET_KEY;
  const sessionId = event.queryStringParameters.session_id;

  if (!SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: "STRIPE_SECRET_KEY não configurada." }) };
  }
  if (!sessionId) {
    return { statusCode: 400, body: JSON.stringify({ error: "session_id ausente." }) };
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: "Basic " + Buffer.from(SECRET + ":").toString("base64") },
    });
    const data = await res.json();
    const paid = data.payment_status === "paid";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ premium: paid }),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "Falha ao verificar pagamento.", details: String(err) }) };
  }
};
