import express from 'express';
import { listarHistoricoController } from '../controllers/HistoricoController.js';

const router = express.Router();


router.get('/', listarHistoricoController);

export default router; 