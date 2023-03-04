import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { router } from './routes';
import { JSONParseError } from './shared/middleware/JSONParseError';
import './shared/services/TranslationsYup';

interface Error {
  status?: number;
  message?: string;
}

const server = express();

server.use(cors({
  origin: process.env.ENABLE_CORS?.split(';') || []
}));

server.use(express.json());

server.use(JSONParseError);

server.use(router);

server.use(async (err: Error, req: express.Request, res: express.Response) => {
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({ errors: err });
  }
  return res.status(500).json({ error: 'Internal server error' });
});

export { server };
