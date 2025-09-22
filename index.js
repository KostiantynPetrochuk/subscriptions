const Fastify = require('fastify');
const { jwtVerify, createRemoteJWKSet } = require("jose");

const fastify = Fastify({ logger: false });
const PORT = process.env.PORT || 3000;

// const APPLE_JWKS_URL = "https://api.storekit.itunes.apple.com/inApps/v1/jwsKeys";
const JWKS_URL = "https://api.storekit-sandbox.itunes.apple.com/inApps/v1/jwsKeys";
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

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
  verifyAndDecode(request.body.signedPayload)
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

async function verifyAndDecode(signedPayload) {
  try {
    const { payload, protectedHeader } = await jwtVerify(signedPayload, JWKS);
    console.log("✅ Verified signature!");
    console.log("Header:", protectedHeader);
    console.log("Payload:", payload);
    return payload;
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    throw err;
  }
}