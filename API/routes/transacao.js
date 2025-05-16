import express from 'express';
import { registrarTransacao, listarTransacoes, obterTransacao, atualizarTransacaoController, excluirTransacao, obterSaldo, obterSaldoMensal, obterGastosPorCategoria } from '../controllers/TransacaoController.js';

const router = express.Router();

// Rotas de transações
router.post('/', registrarTransacao);
router.get('/', listarTransacoes);
router.get('/:id', obterTransacao);
router.put('/:id', atualizarTransacaoController);
router.delete('/:id', excluirTransacao);

export default router; 