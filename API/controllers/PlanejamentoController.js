import { logActivity } from '../config/database.js';
import { criarMeta, buscarMetasPorCategoria } from '../models/Metas.js';
import { criarTransacao, listarTransacoes, calcularSaldo } from '../models/Transacoes.js';
import { buscarUsuarioPorId } from '../models/Usuario.js';

// Criar planejamento financeiro (criar meta vinculada a categoria)
const criarPlanejamento = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome, valor_objetivo, prazo, categoria_id, descricao } = req.body;

    // Validar dados
    if (!nome || !valor_objetivo || !prazo || !categoria_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos os campos são obrigatórios: nome, valor_objetivo, prazo e categoria_id'
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

    // Criar meta
    const metaDados = {
      usuario_id: userId,
      nome,
      valor_objetivo,
      prazo,
      categoria_id,
      descricao: descricao || null,
      criado_em: new Date()
    };

    const metaId = await criarMeta(metaDados);
    
    // Registrar log de atividade
    await logActivity(userId, 'criar_planejamento', `Usuário criou planejamento "${nome}" com meta de ${valor_objetivo}`);

    res.status(201).json({
      status: 'success',
      message: 'Planejamento financeiro criado com sucesso',
      data: { id: metaId }
    });
  } catch (error) {
    console.error('Erro ao criar planejamento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar planejamento financeiro'
    });
  }
};

// Registrar transação vinculada a uma meta
const registrarTransacaoParaMeta = async (req, res) => {
  try {
    const userId = req.userId;
    const { meta_id, tipo, valor, data, categoria_id, descricao, forma_pagamento } = req.body;

    // Validação básica
    if (!meta_id || !tipo || !valor || !data) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos os campos são obrigatórios: meta_id, tipo, valor e data'
      });
    }

    // Criar transação
    const transacaoDados = {
      usuario_id: userId,
      meta_id,
      categoria_id: categoria_id || null,
      tipo,
      valor,
      data,
      descricao: descricao || null,
      forma_pagamento: forma_pagamento || null
    };

    const transacaoId = await criarTransacao(transacaoDados);
    
    // Registrar log de atividade
    await logActivity(userId, 'registrar_transacao_meta', `Usuário registrou ${tipo} de ${valor} para meta ID ${meta_id}`);

    res.status(201).json({
      status: 'success',
      message: 'Transação registrada com sucesso para a meta',
      data: { id: transacaoId }
    });
  } catch (error) {
    console.error('Erro ao registrar transação para meta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao registrar transação'
    });
  }
};

// Obter resumo do planejamento financeiro do usuário
const obterResumoPlanejamento = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Obter dados do usuário
    const usuario = await buscarUsuarioPorId(userId);
    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }
    
    // Calcular saldo geral
    const saldoGeral = await calcularSaldo(userId);
    
    // Obter transações recentes
    const transacoesRecentes = await listarTransacoes(userId, { limit: 5 });
    
    // Construir resposta
    const resumo = {
      usuario: {
        nome: usuario.nome,
        email: usuario.email
      },
      financeiro: {
        saldo: saldoGeral.saldo,
        totalEntradas: saldoGeral.totalEntradas,
        totalSaidas: saldoGeral.totalSaidas
      },
      transacoesRecentes
    };
    
    res.status(200).json({
      status: 'success',
      data: resumo
    });
  } catch (error) {
    console.error('Erro ao obter resumo do planejamento:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter resumo do planejamento financeiro'
    });
  }
};

// Obter metas e transações por categoria
const obterPlanejamentoPorCategoria = async (req, res) => {
  try {
    const userId = req.userId;
    const { categoria_id } = req.params;
    
    // Buscar metas da categoria
    const metas = await buscarMetasPorCategoria(userId, categoria_id);
    
    // Buscar transações da categoria
    const transacoes = await listarTransacoes(userId, { categoria_id });
    
    res.status(200).json({
      status: 'success',
      data: {
        metas,
        transacoes
      }
    });
  } catch (error) {
    console.error('Erro ao obter planejamento por categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter planejamento por categoria'
    });
  }
};

export {
  criarPlanejamento,
  registrarTransacaoParaMeta,
  obterResumoPlanejamento,
  obterPlanejamentoPorCategoria
}; 