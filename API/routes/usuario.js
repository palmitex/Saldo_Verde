import express from 'express';
import { cadastrarUsuarioController, loginController, recuperarSenhaController, obterPerfilController, atualizarPerfilController, excluirContaController } from '../controllers/UsuarioController.js';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.post('/cadastrar', cadastrarUsuarioController);
router.post('/login', loginController);
router.post('/recuperar-senha', recuperarSenhaController);

// Rotas protegidas (requerem autenticação)
router.get('/perfil',  obterPerfilController);
router.put('/perfil',  atualizarPerfilController);
router.delete('/conta', excluirContaController);

export default router; 