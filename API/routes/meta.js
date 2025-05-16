import express from 'express';

import { criarMetaController, listarMetasController, obterMetaController, atualizarMetaController, excluirMetaController, verificarProgressoMetasController } from '../controllers/MetaController.js';

const router = express.Router();

// Rotas de metas
router.get('/', listarMetasController);
router.post('/', criarMetaController);
router.get('/progresso', verificarProgressoMetasController);
router.get('/:id', obterMetaController);
router.put('/:id', atualizarMetaController);
router.delete('/:id', excluirMetaController);

export default router;