import express from 'express';

import { criarMetaController, listarMetasController, obterMetaController, atualizarMetaController, excluirMetaController } from '../controllers/MetaController.js';

const router = express.Router();


router.get('/', listarMetasController);
router.post('/', criarMetaController);
router.get('/usuario/:id', (req, res, next) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Você só pode acessar suas próprias metas.'
    });
  }
  next();
}, listarMetasController);
router.get('/:id', obterMetaController);
router.put('/:id', atualizarMetaController);
router.delete('/:id', excluirMetaController);

export default router;