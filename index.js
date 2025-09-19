const Fastify = require('fastify');

const fastify = Fastify({ logger: false });
const PORT = process.env.PORT || 3000;

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
    console.log('Received log:',request.body)
    return { status: 'ok' };
});


fastify.post('/webhook/apple', async (request, reply) => {
    console.log('Received apple webhook:', request.body);
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
