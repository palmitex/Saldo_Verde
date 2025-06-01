import express from 'express';
import { cadastrarUsuarioController, loginController, recuperarSenhaController, obterPerfilController, atualizarPerfilController, excluirContaController, obterPerguntaSecretaController } from '../controllers/UsuarioController.js';

const router = express.Router();

router.post('/cadastrar', cadastrarUsuarioController);
router.post('/login', loginController);
router.post('/recuperar-senha', recuperarSenhaController);
router.get('/pergunta-secreta', obterPerguntaSecretaController);


// Rotas protegidas (requerem autenticação)
router.get('/perfil',  obterPerfilController);
router.put('/perfil',  atualizarPerfilController);
router.delete('/perfil', excluirContaController);

export default router; 