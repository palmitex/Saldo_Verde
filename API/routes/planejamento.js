import express from 'express';
import { criarPlanejamento, registrarTransacaoParaMeta, obterResumoPlanejamento, obterPlanejamentoPorCategoria } from '../controllers/PlanejamentoController.js';

const router = express.Router();

// Rotas de planejamento financeiro
router.post('/', criarPlanejamento);
router.post('/transacao', registrarTransacaoParaMeta);
router.get('/resumo', obterResumoPlanejamento);
router.get('/categoria/:categoria_id', obterPlanejamentoPorCategoria);

export default router; 