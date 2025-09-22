const Fastify = require('fastify');
const jwt = require('jsonwebtoken');

const fastify = Fastify({ logger: false });
const PORT = process.env.PORT || 3000;

// const APPLE_JWKS_URL = "https://api.storekit.itunes.apple.com/inApps/v1/jwsKeys";
// const JWKS_URL = "https://api.storekit-sandbox.itunes.apple.com/inApps/v1/jwsKeys";

fastify.post('/purchase', async (request, reply) => {
  const { receipt, userId } = request.body;
  if (!receipt || !userId) {
    return reply.status(400).send({ error: 'Missing receipt or userId' });
  }

  // Sandbox endpoint: https://sandbox.itunes.apple.com/verifyReceipt

  console.log(`Received purchase from user ${userId}:`, receipt);
  return { status: 'ok' };
});


fastify.post('/log', async (request, reply) => {
  console.log('Received log:', request.body)
  return { status: 'ok' };
});

fastify.post('/error', async (request, reply) => {
  console.log('Received error:', request.body)
  return { status: 'ok' };
});


fastify.post('/webhook/apple', async (request, reply) => {
  console.log('Received apple webhook:', request.body);
  try {
    const decoded = decodeJWS(request.body.signedPayload);
    console.log("Decoded JWS:", decoded);
    const transactionInfo = decodeJWS(decoded.payload.data.signedTransactionInfo);
    const renewalInfo = decodeJWS(decoded.payload.data.signedRenewalInfo);
    console.log("Decoded transactionInfo:", transactionInfo);
    console.log("Decoded renewalInfo:", renewalInfo);
  } catch (err) {
    console.error("❌ Decoding failed:", err.message);
  }
  return { status: 'ok' };
});


fastify.post('/webhook/google', async (request, reply) => {
  console.log('Received google webhook:', request.body);
  return { status: 'ok' };
});

fastify.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => console.log(`Server running on port ${PORT}`))
  .catch(err => {
    fastify.log.error(err);
    process.exit(1);
  });

// просто декодуємо JWS, не перевіряючи підпис
function decodeJWS(signedPayload) {
  // jsonwebtoken decode не перевіряє підпис без ключа
  const decoded = jwt.decode(signedPayload, { complete: true });
  // decoded.header, decoded.payload
  return decoded;
}