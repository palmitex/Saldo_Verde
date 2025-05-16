import express from 'express';
import { listarCategoriasController, obterCategoriaController, criarCategoriaController, atualizarCategoriaController, excluirCategoriaController} from '../controllers/CategoriaController.js';

const router = express.Router();

// Rotas de categorias
router.get('/', listarCategoriasController);
router.get('/:id', obterCategoriaController);
router.post('/', criarCategoriaController);
router.put('/:id', atualizarCategoriaController);
router.delete('/:id', excluirCategoriaController);

export default router; 