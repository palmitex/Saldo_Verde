import express from 'express';
import { listarCategorias, obterCategoria, registrarCategoria, atualizarCategoriaController } from '../controllers/CategoriaController.js';

const router = express.Router();


router.get('/', listarCategorias);
router.get('/:id', obterCategoria);
router.post('/', registrarCategoria);
router.put('/:id', atualizarCategoriaController);

export default router;