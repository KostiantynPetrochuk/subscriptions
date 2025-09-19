const Fastify = require('fastify');

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 3000;

// POST /purchase - клієнт надсилає receipt після першої покупки
fastify.post('/purchase', async (request, reply) => {
    const { receipt, userId } = request.body;
    if (!receipt || !userId) {
        return reply.status(400).send({ error: 'Missing receipt or userId' });
    }

    // Тут можна валідувати через Apple sandbox API
    // Sandbox endpoint: https://sandbox.itunes.apple.com/verifyReceipt

    console.log(`Received purchase from user ${userId}:`, receipt);
    return { status: 'ok' };
});

// POST /purchase - клієнт надсилає receipt після першої покупки
fastify.post('/log', async (request, reply) => {
    console.log(request.body)
    return { status: 'ok' };
});

// POST /webhook/renew - Apple повідомляє про продовження підписки
fastify.post('/webhook/renew', async (request, reply) => {
    console.log('Received renew webhook:', request.body);
    return { status: 'ok' };
});

// POST /webhook/cancel - Apple повідомляє про скасування підписки
fastify.post('/webhook/cancel', async (request, reply) => {
    console.log('Received cancel webhook:', request.body);
    return { status: 'ok' };
});

fastify.listen({ port: PORT, host: '0.0.0.0' })
    .then(() => console.log(`Server running on port ${PORT}`))
    .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });
