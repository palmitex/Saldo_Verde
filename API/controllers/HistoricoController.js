import { verHistorico, verHistoricoEspecifico } from '../models/Historico.js';
import { logActivity } from '../config/database.js';

// Listar todo o histórico
const listarHistoricoController = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Obter histórico
    const historico = await verHistorico();
    
    // Registrar log de atividade
    await logActivity(userId, 'listar_historico', 'Usuário visualizou histórico');

    res.status(200).json({
      status: 'success',
      data: historico
    });
  } catch (error) {
    console.error('Erro ao listar histórico:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar histórico'
    });
  }
};

// Obter histórico específico
 const obterHistoricoEspecificoController = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumo } = req.params;

    // Obter histórico específico
    const historico = await verHistoricoEspecifico(resumo);
    
    if (!historico) {
      return res.status(404).json({
        status: 'error',
        message: 'Histórico não encontrado'
      });
    }

    // Registrar log de atividade
    await logActivity(userId, 'ver_historico_especifico', `Usuário visualizou histórico específico`);

    res.status(200).json({
      status: 'success',
      data: historico
    });
  } catch (error) {
    console.error('Erro ao obter histórico específico:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter histórico específico'
    });
  }
}; 

export { obterHistoricoEspecificoController, listarHistoricoController}