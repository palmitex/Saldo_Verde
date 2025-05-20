import express from 'express';
import { 
  registrarTransacao, 
  listarTransacoesController, 
  obterTransacao, 
  atualizarTransacaoController, 
  excluirTransacaoController, 
  obterSaldo,
  obterGastosPorPeriodo
} from '../controllers/TransacaoController.js';

const router = express.Router();

// Rotas de transações
router.post('/', registrarTransacao);
router.get('/', listarTransacoesController);
router.get('/usuario/:id', (req, res, next) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Você só pode acessar suas próprias transações.'
    });
  }
  next();
}, listarTransacoesController);
router.get('/analise', obterGastosPorPeriodo);
router.get('/saldo', obterSaldo);
router.get('/:id', obterTransacao);
router.put('/:id', atualizarTransacaoController);
router.delete('/:id', excluirTransacaoController);

export default router;