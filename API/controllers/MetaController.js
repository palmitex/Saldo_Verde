import { logActivity, query } from '../config/database.js';
import { criarMeta,  buscarMetaPorId, buscarMetasPorUsuario, atualizarMeta, excluirMeta } from '../models/Metas.js';

// Criar uma nova meta
const criarMetaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome, valor_objetivo, prazo } = req.body;

    // Validar dados
    if (!nome || !valor_objetivo || !prazo) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos os campos são obrigatórios: nome, valor_objetivo e prazo'
      });
    }

    // Verificar se o prazo é futuro
    const dataPrazo = new Date(prazo);
    const hoje = new Date();
    if (dataPrazo < hoje) {
      return res.status(400).json({
        status: 'error',
        message: 'O prazo deve ser uma data futura'
      });
    }

    // Preparar dados da meta
    const metaDados = {
      usuario_id: userId,
      nome,
      valor_objetivo,
      prazo,
      criado_em: new Date()
    };

    // Criar meta usando modelo
    const metaId = await criarMeta(metaDados);
    
    // Registrar log de atividade
    await logActivity(userId, 'criar_meta', `Usuário criou meta "${nome}" com valor objetivo de ${valor_objetivo}`);

    res.status(201).json({
      status: 'success',
      message: 'Meta criada com sucesso',
      data: { id: metaId }
    });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar meta'
    });
  }
};

// Listar metas do usuário
const listarMetasController = async (req, res) => {
  try {
    const userId = req.userId;

    // Obter metas usando modelo
    const metasBruto = await listarMetasPorUsuario(userId);
    
    // Buscar dados adicionais para calcular progresso
    const metas = await Promise.all(metasBruto.map(async (meta) => {
      // Calcular total de entradas no período da meta
      const sqlEntradas = `
        SELECT SUM(valor) as total 
        FROM transacoes 
        WHERE usuario_id = ? 
          AND tipo = 'entrada' 
          AND data <= CURRENT_DATE 
          AND data >= ?
      `;
      const resultadoEntradas = await query(sqlEntradas, [userId, meta.criado_em]);
      const totalEntradas = parseFloat(resultadoEntradas[0].total || 0);
      
      // Calcular percentual de tempo decorrido
      const hoje = new Date();
      const prazo = new Date(meta.prazo);
      const criacao = new Date(meta.criado_em);
      
      let percentualTempo = 100;
      if (prazo >= hoje) {
        const tempoTotal = prazo.getTime() - criacao.getTime();
        const tempoDecorrido = hoje.getTime() - criacao.getTime();
        percentualTempo = (tempoDecorrido / tempoTotal) * 100;
      }
      
      // Calcular percentual alcançado
      const valorObjetivo = parseFloat(meta.valor_objetivo);
      const percentualAlcancado = Math.min((totalEntradas / valorObjetivo) * 100, 100);
      
      // Determinar status
      let status;
      if (percentualAlcancado >= 100) {
        status = 'concluida';
      } else if (percentualAlcancado >= percentualTempo) {
        status = 'em_dia';
      } else {
        status = 'atrasada';
      }
      
      return {
        ...meta,
        valor_atual: totalEntradas,
        percentual_alcancado: percentualAlcancado,
        percentual_tempo: percentualTempo,
        status
      };
    }));

    res.status(200).json({
      status: 'success',
      data: metas
    });
  } catch (error) {
    console.error('Erro ao listar metas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar metas'
    });
  }
};

// Obter detalhes de uma meta específica
const obterMetaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Buscar meta
    const meta = await buscarMetaPorId(id);
    
    // Verificar se meta existe e pertence ao usuário
    if (!meta || meta.usuario_id !== userId) {
      return res.status(404).json({
        status: 'error',
        message: 'Meta não encontrada'
      });
    }
    
    // Calcular progresso
    const sqlEntradas = `
      SELECT SUM(valor) as total 
      FROM transacoes 
      WHERE usuario_id = ? 
        AND tipo = 'entrada' 
        AND data <= CURRENT_DATE 
        AND data >= ?
    `;
    const resultadoEntradas = await query(sqlEntradas, [userId, meta.criado_em]);
    const totalEntradas = parseFloat(resultadoEntradas[0].total || 0);
    
    // Calcular percentual de tempo decorrido
    const hoje = new Date();
    const prazo = new Date(meta.prazo);
    const criacao = new Date(meta.criado_em);
    
    let percentualTempo = 100;
    if (prazo >= hoje) {
      const tempoTotal = prazo.getTime() - criacao.getTime();
      const tempoDecorrido = hoje.getTime() - criacao.getTime();
      percentualTempo = (tempoDecorrido / tempoTotal) * 100;
    }
    
    // Calcular percentual alcançado
    const valorObjetivo = parseFloat(meta.valor_objetivo);
    const percentualAlcancado = Math.min((totalEntradas / valorObjetivo) * 100, 100);
    
    // Determinar status
    let status;
    if (percentualAlcancado >= 100) {
      status = 'concluida';
    } else if (percentualAlcancado >= percentualTempo) {
      status = 'em_dia';
    } else {
      status = 'atrasada';
    }
    
    const metaCompleta = {
      ...meta,
      valor_atual: totalEntradas,
      percentual_alcancado: percentualAlcancado,
      percentual_tempo: percentualTempo,
      status
    };

    res.status(200).json({
      status: 'success',
      data: metaCompleta
    });
  } catch (error) {
    console.error('Erro ao obter meta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter meta'
    });
  }
};

// Atualizar uma meta
const atualizarMetaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { nome, valor_objetivo, prazo } = req.body;

    // Validar dados
    if (prazo) {
      const dataPrazo = new Date(prazo);
      const hoje = new Date();
      if (dataPrazo < hoje) {
        return res.status(400).json({
          status: 'error',
          message: 'O prazo deve ser uma data futura'
        });
      }
    }
    
    // Verificar se meta existe e pertence ao usuário
    const meta = await buscarMetaPorId(id);
    if (!meta || meta.usuario_id !== userId) {
      return res.status(404).json({
        status: 'error',
        message: 'Meta não encontrada'
      });
    }

    // Preparar dados para atualização
    const dadosAtualizados = {};
    
    if (nome) dadosAtualizados.nome = nome;
    if (valor_objetivo) dadosAtualizados.valor_objetivo = valor_objetivo;
    if (prazo) dadosAtualizados.prazo = prazo;

    // Atualizar meta
    await atualizarMeta(id, dadosAtualizados);
    
    // Registrar log de atividade
    await logActivity(userId, 'atualizar_meta', `Usuário atualizou meta ID ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Meta atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar meta'
    });
  }
};

// Excluir uma meta
const excluirMetaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se meta existe e pertence ao usuário
    const meta = await buscarMetaPorId(id);
    if (!meta || meta.usuario_id !== userId) {
      return res.status(404).json({
        status: 'error',
        message: 'Meta não encontrada'
      });
    }

    // Excluir meta
    await excluirMeta(id);
    
    // Registrar log de atividade
    await logActivity(userId, 'excluir_meta', `Usuário excluiu meta ID ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Meta excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir meta'
    });
  }
};

// Verificar progresso das metas
const verificarProgressoMetasController = async (req, res) => {
  try {
    const userId = req.userId;

    // Buscar metas em andamento
    const hoje = new Date().toISOString().split('T')[0];
    const metas = await buscarMetasPorUsuario(userId, { prazoMinimo: hoje });

    // Calcular progresso para cada meta
    const metasComProgresso = await Promise.all(metas.map(async (meta) => {
      // Calcular total de entradas no período da meta
      const sqlEntradas = `
        SELECT SUM(valor) as total 
        FROM transacoes 
        WHERE usuario_id = ? 
          AND tipo = 'entrada' 
          AND data <= CURRENT_DATE 
          AND data >= ?
      `;
      const resultadoEntradas = await query(sqlEntradas, [userId, meta.criado_em]);
      const totalEntradas = parseFloat(resultadoEntradas[0].total || 0);
      
      // Calcular percentual de tempo decorrido
      const hoje = new Date();
      const prazo = new Date(meta.prazo);
      const criacao = new Date(meta.criado_em);
      
      const tempoTotal = prazo.getTime() - criacao.getTime();
      const tempoDecorrido = hoje.getTime() - criacao.getTime();
      const percentualTempo = (tempoDecorrido / tempoTotal) * 100;
      
      // Calcular percentual alcançado
      const valorObjetivo = parseFloat(meta.valor_objetivo);
      const percentualAlcancado = Math.min((totalEntradas / valorObjetivo) * 100, 100);
      
      // Determinar status
      let status;
      if (percentualAlcancado >= 100) {
        status = 'concluida';
      } else if (percentualAlcancado >= percentualTempo) {
        status = 'em_dia';
      } else {
        status = 'atrasada';
      }
      
      return {
        id: meta.id,
        nome: meta.nome,
        valor_objetivo: valorObjetivo,
        valor_atual: totalEntradas,
        prazo: meta.prazo,
        percentual_alcancado: percentualAlcancado,
        percentual_tempo: percentualTempo,
        status
      };
    }));

    res.status(200).json({
      status: 'success',
      data: metasComProgresso
    });
  } catch (error) {
    console.error('Erro ao verificar progresso das metas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao verificar progresso das metas'
    });
  }
};

export { 
  criarMetaController, 
  listarMetasController, 
  obterMetaController, 
  atualizarMetaController, 
  excluirMetaController, 
  verificarProgressoMetasController 
};