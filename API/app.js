import express from 'express';
const app = express();
const port = 3001;
import cors from 'cors';

import categoriaRotas from './routes/categoria.js';
import metaRotas from './routes/meta.js';
import transicaoRotas from './routes/transacao.js';
import usuarioRotas from './routes/usuario.js';

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para extrair userId dos parâmetros de consulta
app.use((req, res, next) => {
    if (req.query.userId) {
        req.userId = parseInt(req.query.userId);
    }
    next();
});
app.use('/categorias', categoriaRotas);
app.use('/metas', metaRotas);
app.use('/transacoes', transicaoRotas);
app.use('/usuarios', usuarioRotas);

// Rota raiz
app.get('/', (req, res) => {
    res.status(200).send('API do controle financeiro educacional')
});

// Rota OPTIONS para CORS preflight
app.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS')
    res.status(204).send()
});

// Middleware de erro 404
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Rota não encontrada'});
});

// Middleware de erro global
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 'error', 
        message: 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta: http://localhost:${port}`)
});