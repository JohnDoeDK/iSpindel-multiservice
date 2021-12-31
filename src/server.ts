import fastify from 'fastify';
import getConfig from './config';
import debug from './services/debug';
import ubidots from './services/ubidots';
import httpHook from './services/http';
import homeAssistant from './services/homeassistant';

export default async (): Promise<void> => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  let config;
  try {
    config = await getConfig();
  } catch ( err) {
    console.log(err);
    process.exit(1);
  }

  const { serverPath = '/' } = config;

  const server = fastify({
    logger: { level: process.env.ISMS_DEBUG ? 'debug' : 'info' },
  });

  server.addHook('onResponse', debug);
  server.addHook('onResponse', ubidots);
  server.addHook('onResponse', httpHook);
  server.addHook('onResponse', homeAssistant);

  const opts = {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          ID: { type: 'number' },
          token: { type: 'string' },
          temperature: { type: 'number' },
          temp_units: { type: 'string' },
          battery: { type: 'number' },
          gravity: { type: 'number' },
          interval: { type: 'number' },
          RSSI: { type: 'number' },
        },
      },
    },
  };

  server.get(serverPath, async () => {return { status: '🍺' };});
  server.post(serverPath, opts, async () => {return { status: '🍺🍺🍺' };});

  server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
};
