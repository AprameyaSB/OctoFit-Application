import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;
const host = process.env.HOST || '0.0.0.0';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'octofit-backend',
    apiBaseUrl,
    port,
    message: 'Use /api/health, /api/users, or /api/activities',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-backend', apiBaseUrl, port });
});

app.use('/api', apiRoutes);

export function startServer() {
  return app.listen(port, host, () => {
    console.log(`OctoFit backend listening on ${host}:${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
  });
}

if (require.main === module) {
  startServer();
}
