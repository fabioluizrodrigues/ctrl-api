import express from 'express';

const server = express();

server.get('/', (req, res, next) => {
    return res.send('Olá, DEV!');
});

export { server };