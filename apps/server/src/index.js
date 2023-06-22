import { createServer } from 'node:net';
import { deserialize } from 'bson';
import { runAI, runOCR, trainAI } from './events/index.js';

const server = createServer(async (client) => {
	client.on('data', async (data) => {
		const eventData = deserialize(data, {
			allowObjectSmallerThanBufferSize: true
		});

		switch (eventData.op) {
		case 1: {
			runAI(client, eventData);
			break;
		}

		case 3: {
			trainAI(eventData);
			break;
		}

		case 5: {
			await runOCR(client, eventData);
			break;
		}
		}
	});
});

server.listen(process.env.PORT || 3000);
