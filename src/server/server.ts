import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { router } from './routes';
import './shared/services/TranslationsYup';

const server = express();

server.use(cors({
  origin: process.env.ENABLE_CORS?.split(';') || []
}));

server.use(express.json());

server.use(router);

server.use(async (err: Error, req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({ errors: err });
  }
  return res.status(500).json({ error: 'Internal server error' });
});

export { server };
