import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import { router } from './routes';
import { JSONParseError } from './shared/middleware/JSONParseError';
import './shared/services/TranslationsYup';

const server = express();

server.use(cors({
  origin: process.env.ENABLE_CORS?.split(';') || []
}));

server.use(express.json());

server.use(JSONParseError);

server.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({ errors: err }).end();
  }
  return res.status(500).json({ error: 'Internal server error' }).end();
});

export { server };
