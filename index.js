require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/v1/', router);
const server = app.listen(port, () => console.log(`🚀 Listening on port ${port}!`));

function gracfulShutdown(signal) {
	console.info(`⚠️ ${signal} signal received.`);
	server.close(() => {
		console.log('👋Http server closed.');
		process.exit(0);
	});
}

process.on('SIGINT', () => {
	gracfulShutdown('SIGINT');
});
process.on('SIGTERM', () => {
	gracfulShutdown('SIGTERM');
});
