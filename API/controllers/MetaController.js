import { logActivity, query } from '../config/database.js';
import { criarMeta,  buscarMetaPorId, buscarMetasPorUsuario, atualizarMeta, excluirMeta } from '../models/Metas.js';

// Criar uma nova meta
const criarMetaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome, valor_objetivo, valor_inicial, prazo } = req.body;

    console.log('Dados recebidos para criar meta:', { nome, valor_objetivo, valor_inicial, prazo });

    // Validar dados obrigatórios
    if (!nome || !valor_objetivo || !valor_inicial || !prazo) {
      return res.status(400).json({
        status: 'error',
        message: 'Os campos nome, valor_objetivo, valor_inicial e prazo são obrigatórios'
      });
    }

    // Validar valor objetivo
    const valorObjetivo = parseFloat(valor_objetivo);
    if (isNaN(valorObjetivo) || valorObjetivo <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'O valor objetivo deve ser um número positivo'
      });
    }

    // Validar valor inicial
    const valorInicial = parseFloat(valor_inicial);
    if (isNaN(valorInicial) || valorInicial < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'O valor inicial deve ser um número não negativo'
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
      nome: nome.trim(),
      valor_objetivo: valorObjetivo,
      valor_inicial: valorInicial,
      prazo,
      criado_em: new Date()
    };

    console.log('Dados da meta a ser criada:', metaDados);

    // Criar meta usando modelo
    const metaId = await criarMeta(metaDados);
    
    // Registrar log de atividade
    await logActivity(userId, 'criar_meta', `Usuário criou meta "${nome}" com valor objetivo de ${valorObjetivo}`);

    res.status(201).json({
      status: 'success',
      message: 'Meta criada com sucesso',
      data: { 
        id: metaId,
        ...metaDados,
        progresso: valorInicial,
        percentual: Math.min((valorInicial / valorObjetivo) * 100, 100)
      }
    });
  } catch (error) {
    console.error('Erro detalhado ao criar meta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar meta',
      error: error.message
    });
  }
};

// Listar metas do usuário
const listarMetasController = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Listando metas para usuário:', userId);

    if (!userId) {
      console.error('Usuário não autenticado');
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    // Obter metas usando modelo
    const metasBruto = await buscarMetasPorUsuario(userId);
    console.log('Metas brutas encontradas:', metasBruto);
    
    // Se não houver metas, retornar array vazio
    if (!metasBruto || !Array.isArray(metasBruto)) {
      console.log('Nenhuma meta encontrada ou formato inválido');
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }
    
    // Calcular progresso para cada meta
    const metas = metasBruto.map(meta => {
      const valorObjetivo = parseFloat(meta.valor_objetivo);
      const valorInicial = parseFloat(meta.valor_inicial);
      const percentual = Math.min((valorInicial / valorObjetivo) * 100, 100);
      
      return {
        ...meta,
        valor_objetivo: valorObjetivo,
        valor_inicial: valorInicial,
        percentual: percentual
      };
    });

    console.log('Metas processadas:', metas);

    res.status(200).json({
      status: 'success',
      data: metas
    });
  } catch (error) {
    console.error('Erro ao listar metas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar metas',
      error: error.message
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
    const { id } = req.params;
    const userId = req.userId;
    const { titulo, descricao, valor_objetivo, valor_inicial, data_limite } = req.body;

    console.log('Atualizando meta:', { id, userId, dados: req.body });

    if (!id || !userId) {
      console.error('ID da meta ou usuário não fornecido');
      return res.status(400).json({
        status: 'error',
        message: 'ID da meta e usuário são obrigatórios'
      });
    }

    const meta = await buscarMetaPorId(id);
    console.log('Meta encontrada:', meta);

    if (!meta) {
      console.error('Meta não encontrada para o ID:', id);
      return res.status(404).json({
        status: 'error',
        message: 'Meta não encontrada'
      });
    }

    if (String(meta.usuario_id) !== String(userId)) {
      console.error('Meta não pertence ao usuário:', { metaUsuarioId: meta.usuario_id, userId });
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para atualizar esta meta'
      });
    }

    // Validar dados
    if (data_limite) {
      const dataLimite = new Date(data_limite);
      const hoje = new Date();
      if (dataLimite < hoje) {
        return res.status(400).json({
          status: 'error',
          message: 'A data limite deve ser uma data futura'
        });
      }
    }
    
    // Preparar dados para atualização
    const dadosAtualizados = {};
    
    if (titulo) dadosAtualizados.nome = titulo;
    if (descricao) dadosAtualizados.descricao = descricao;
    if (valor_objetivo) dadosAtualizados.valor_objetivo = valor_objetivo;
    if (valor_inicial) dadosAtualizados.valor_inicial = valor_inicial;
    if (data_limite) dadosAtualizados.data_limite = data_limite;

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
    const { id } = req.params;
    const userId = req.userId;

    console.log('Excluindo meta:', { id, userId });

    if (!id || !userId) {
      console.error('ID da meta ou usuário não fornecido');
      return res.status(400).json({
        status: 'error',
        message: 'ID da meta e usuário são obrigatórios'
      });
    }

    const meta = await buscarMetaPorId(id);
    console.log('Meta encontrada:', meta);

    if (!meta) {
      console.error('Meta não encontrada para o ID:', id);
      return res.status(404).json({
        status: 'error',
        message: 'Meta não encontrada'
      });
    }

    // No método excluirMetaController
    if (String(meta.usuario_id) !== String(userId)) {
    console.error('Meta não pertence ao usuário:', { metaUsuarioId: meta.usuario_id, userId });
    return res.status(403).json({
    status: 'error',
    message: 'Você não tem permissão para excluir esta meta'
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